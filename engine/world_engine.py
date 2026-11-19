# -*- coding: utf-8 -*-
"""
Lõi Mô Phỏng Thế Giới (Deterministic World Engine) — Cổ Chân Nhân: Cổ Nguyệt Sơn Trại (Năm 1).
- Quản lý nhân bản dữ liệu theo từng lượt chơi (runs/<run_id>/).
- Điều khiển đồng hồ khắc/canh giờ, di chuyển qua các vùng bản đồ (BFS), lịch trình xác suất NPC.
- Tính toán kinh tế, tu luyện Thanh Đồng chân nguyên, nuôi Cổ, xúc xắc d100 và Permadeath / Run Score.
"""

import copy
import json
import os
import random
import uuid
from collections import deque
from typing import Any, Dict, List, Optional, Tuple

from engine.time_system import (
    build_daily_schedule,
    format_clock,
    get_canh_gio,
    get_schedule_reminder,
)
from engine.cultivation import (
    classify_aptitude,
    compute_combat_power,
    get_realm_stage,
    nurture_aperture,
    recover_essence_over_time,
    tick_gu_hunger,
)

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_DIR = os.path.join(ROOT_DIR, "database")
RUNS_DIR = os.path.join(ROOT_DIR, "runs")


def _load_json(path: str) -> Any:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_json(path: str, data: Any) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def roll_d100(target: int) -> Dict[str, Any]:
    """Tung xúc xắc thật d100 và quy đổi sang 6 bậc Delta chuẩn README.md."""
    target = max(1, min(100, int(target)))
    player_roll = random.randint(1, 100)
    delta = player_roll - target
    if delta >= 50:
        tier = "Thành công vượt trội"
        tier_code = "crit_success"
    elif delta >= 15:
        tier = "Thành công trong dự kiến"
        tier_code = "success"
    elif delta >= 0:
        tier = "Thành công suýt soát"
        tier_code = "narrow_success"
    elif delta >= -14:
        tier = "Thất bại suýt soát"
        tier_code = "narrow_fail"
    elif delta >= -49:
        tier = "Thất bại nặng"
        tier_code = "fail"
    else:
        tier = "Thảm bại"
        tier_code = "crit_fail"

    return {
        "target": target,
        "player_roll": player_roll,
        "delta": delta,
        "tier": tier,
        "tier_code": tier_code,
    }


def _clean_gu_name(raw_name: str) -> str:
    # Strip trailing `[Dòng ...]` citations cleanly for UI badges
    if "`[" in raw_name:
        return raw_name.split("`[")[0].strip()
    if "[" in raw_name:
        return raw_name.split("[")[0].strip()
    return raw_name.strip()


class WorldEngine:
    def __init__(self) -> None:
        self.world_map_tpl = _load_json(os.path.join(DB_DIR, "world_map.json"))
        self.npcs_tpl = _load_json(os.path.join(DB_DIR, "npcs.json"))
        self.schedules_tpl = _load_json(os.path.join(DB_DIR, "npc_schedules.json"))
        self.timeline_tpl = _load_json(os.path.join(DB_DIR, "timeline.json"))
        self.econ_tpl = _load_json(os.path.join(DB_DIR, "economy_config.json"))
        self.gu_db = _load_json(os.path.join(DB_DIR, "gu_database.json"))
        self.gu_by_id = {g["id"]: g for g in self.gu_db}
        self.zones_by_id = {z["id"]: z for z in self.world_map_tpl["zones"]}
        os.makedirs(RUNS_DIR, exist_ok=True)

    def _run_dir(self, run_id: str) -> str:
        safe = "".join(c for c in run_id if c.isalnum() or c in ("-", "_"))
        return os.path.join(RUNS_DIR, safe)

    def list_runs(self) -> List[Dict[str, Any]]:
        results = []
        if not os.path.exists(RUNS_DIR):
            return results
        for name in sorted(os.listdir(RUNS_DIR), reverse=True):
            state_path = os.path.join(RUNS_DIR, name, "state.json")
            if os.path.isfile(state_path):
                try:
                    st = _load_json(state_path)
                    p = st["player"]
                    clk = format_clock(st["day"], st["minute_of_day"])
                    results.append({
                        "run_id": st["run_id"],
                        "player_name": p["name"],
                        "aptitude": f"{p['aptitude_grade']} đẳng ({p['aptitude_percent']}%)",
                        "background": p["background_label"],
                        "realm": f"{'Nhất' if p['rank']==1 else 'Nhị'} chuyển {p['sub_realm']}",
                        "status": st["status"],
                        "day": st["day"],
                        "clock_short": clk["short_display"],
                        "stones": p["stones"],
                    })
                except Exception:
                    continue
        return results

    def make_gu_instance(self, gu_id: str) -> Dict[str, Any]:
        raw = self.gu_by_id.get(gu_id)
        feed_cfg = self.econ_tpl["gu_feeding_defaults"].get(
            gu_id, self.econ_tpl["gu_feeding_defaults"]["DEFAULT"]
        )
        name = _clean_gu_name(raw["ten_goi"]) if raw else gu_id
        return {
            "id": gu_id,
            "name": name,
            "rank": raw["pham_cap"] if raw else "Nhất Chuyển (Rank 1)",
            "rarity": raw["do_quy_hiem"] if raw else "Phổ thông",
            "effect_short": (raw["cong_nang_cu_the"][:220] + "...") if raw and len(raw["cong_nang_cu_the"]) > 220 else (raw["cong_nang_cu_the"] if raw else ""),
            "feed_interval_days": feed_cfg["interval_days"],
            "days_until_hungry": feed_cfg["interval_days"],
            "food_id": feed_cfg["food_id"],
            "food_name": feed_cfg["food_name"],
            "starving": False,
            "alive": True,
        }

    def create_run(
        self,
        name: str,
        background: str = "orphan",
        aptitude_percent: int = 44,
        initial_goal: str = "Tích lũy nguyên thạch, giữ mạng sống và đột phá tu vi trước Đại Hội Sát Hạch",
    ) -> Dict[str, Any]:
        """Tạo lượt chơi mới: nhân bản dữ liệu NPC và Timeline vào runs/<run_id>/."""
        run_id = f"run_{uuid.uuid4().hex[:8]}"
        rdir = self._run_dir(run_id)
        os.makedirs(rdir, exist_ok=True)

        # Giới hạn tư chất hợp lý theo thiết kế: 22% .. 95% (≤ Phương Chính 99%)
        aptitude_percent = max(22, min(95, int(aptitude_percent)))
        apt_grade = classify_aptitude(aptitude_percent)
        max_thanh = round(aptitude_percent / 10.0, 2)

        is_orphan = background == "orphan"
        bg_label = "Cô nhi (Tự lập — Khó)" if is_orphan else "Bố mẹ bình dân (Hỗ trợ nhẹ)"
        starting_stones = (
            self.econ_tpl["living_costs"]["orphan_starting_stones"]
            if is_orphan
            else self.econ_tpl["living_costs"]["commoner_starting_stones"]
        )

        # Tính hệ số độ khó dựa trên Gia cảnh + Tư chất
        difficulty_score = 1.0
        if is_orphan:
            difficulty_score += 0.35
        if apt_grade == "Đinh":
            difficulty_score += 0.65
            difficulty_label = "Địa Ngục (Đinh đẳng)"
        elif apt_grade == "Bính":
            difficulty_score += 0.35
            difficulty_label = "Khắc Nghiệt (Chuẩn Nguyên Tác)"
        elif apt_grade == "Ất":
            difficulty_score += 0.15
            difficulty_label = "Cân Bằng (Ất đẳng)"
        else:
            difficulty_label = "Thiên Tài (Giáp đẳng ≤ Phương Chính)"

        schedule = build_daily_schedule(initial_goal, 1, "Xuân")

        # Bản sao riêng của NPC & Timeline cho lượt chơi này
        npcs_clone = copy.deepcopy(self.npcs_tpl["npcs"])
        timeline_clone = copy.deepcopy(self.timeline_tpl["events"])

        # Khởi tạo trạng thái
        player = {
            "name": (name or "Cổ Nguyệt Trần").strip()[:32],
            "age": 15,
            "background": background,
            "background_label": bg_label,
            "difficulty_label": difficulty_label,
            "difficulty_multiplier": round(difficulty_score, 2),
            "aptitude_percent": aptitude_percent,
            "aptitude_grade": apt_grade,
            "rank": 1,
            "sub_realm": "sơ giai",
            "essence_thanh": max_thanh,
            "max_thanh": max_thanh,
            "wall_progress": 0.0,
            "hp": 100,
            "max_hp": 100,
            "stamina": 100,
            "max_stamina": 100,
            "stones": starting_stones,
            "living_debt_fraction": 0.0,
            "reputation": 0,      # -100 Ma Đạo .. +100 Chính Đạo
            "luck": random.randint(-5, 10),
            "boar_strength": 0.0,  # 0.0 -> 1.0 (1 trư lực)
            "combat_skill": 5,
            "attendance_score": 0,
            "tardy_count": 0,
            "paying_pn_extortion": False,
            "defied_pn": False,
            "has_hunt_permit": False,
            "discovered_zones": [z["id"] for z in self.world_map_tpl["zones"] if not z.get("hidden")],
            "gu_list": [],
            "inventory": {
                "nguyet_lan_thao": 2,
                "luong_kho": 2,
            },
            "factions": {
                "Tộc Trưởng nhất hệ": 0,
                "Mạc Mạch": 0,
                "Xích Mạch": 0,
                "Trung lập": 5,
            },
        }

        state = {
            "run_id": run_id,
            "status": "active",  # active | dead | completed
            "death_reason": None,
            "day": 1,
            "minute_of_day": 360,  # 06:00 Giờ Mão ngày Khai Khiếu
            "location": "tu_duong",
            "goal": initial_goal,
            "schedule": schedule,
            "price_multiplier": 1.0,
            "active_scene": {
                "in_scene": True,
                "title": "Đại Điển Khai Khiếu tại Cổ Nguyệt Từ Đường",
                "trigger_type": "timeline",
                "event_id": "khai_khieu",
                "present_npcs": ["co_nguyet_bac", "hoc_duong_gia_lao", "phuong_nguyen", "phuong_chinh", "mac_bac", "xich_thanh"],
                "publicity": "công khai (trước toàn tộc & 57 đệ tử)",
                "scene_turns": 0,
                "summary_notes": [],
            },
            "last_stipend_day": 0,
            "last_family_support_month": 1,
            "exam_round1_score": 0,
            "exam_final_rank": None,
            "assigned_squad": None,
            "deep_impacts_count": 0,
            "world_flags": {},
            "player": player,
        }

        # Đánh dấu sự kiện khai_khieu đã mở màn
        timeline_clone[0]["triggered"] = True
        timeline_clone[0]["status"] = "active"

        rumors = [
            {
                "day": 1,
                "text": "Khai Khiếu Đại Điển năm nay xuất hiện thiên tài Giáp đẳng Cổ Nguyệt Phương Chính (99%), khiến cả sơn trại chấn động; anh trai song sinh Phương Nguyên chỉ đạt Bính đẳng.",
            }
        ]

        opening_text = (
            f"Sáng sớm mùng 1 tháng Giêng Mùa Xuân, sương núi Thanh Mao Sơn còn bảng lảng quanh mái ngói Từ Đường Cổ Nguyệt. "
            f"Dưới hầm ngầm Chân Nguyên Thủy Tuyền, ánh huỳnh quang của bầy Hi Vọng Cổ dập dờn trong làn nước lạnh thấu xương.\n\n"
            f"Sau khoảnh khắc đau nhói nơi đan điền, Không Khiếu của ngươi — **{player['name']}** ({player['background_label']}) — chính thức vỡ mở! "
            f"Kết quả thẩm định vang lên trước Tộc trưởng Cổ Nguyệt Bác và chư vị Gia lão: **Tư chất {apt_grade} đẳng ({aptitude_percent}% Chân nguyên Thanh Đồng Xanh Biếc)**.\n\n"
            f"Cách đó không xa, Cổ Nguyệt Phương Chính đang chìm trong ánh mắt tán thưởng cuồng nhiệt của mọi người với tư chất Giáp đẳng cửu thành cửu; "
            f"còn anh trai hắn, Cổ Nguyệt Phương Nguyên (Bính đẳng 44%), chỉ lặng lẽ đứng trong góc tối với ánh nhìn sâu thẳm như đầm không đáy. "
            f"Từ giây phút này, ngươi có đúng **1 năm (360 ngày)** trước khi bước lên lôi đài **Đại Hội Niên Mạt Khảo Hạch**.\n\n"
            f"Học Đường Gia Lão cất giọng trầm vang: *\"Tất cả 57 tân đệ tử đã thức tỉnh, hai ngày nữa chính thức nhập Học Đường nhận Bản Mệnh Cổ. Trước mắt, ngươi định nói gì hay hành động ra sao trong đại sảnh Từ Đường này?\"*"
        )

        history = [
            {
                "id": uuid.uuid4().hex[:8],
                "role": "gm",
                "kind": "timeline",
                "clock": format_clock(state["day"], state["minute_of_day"])["short_display"],
                "title": "Đại Điển Khai Khiếu",
                "text": opening_text,
                "suggested_actions": [
                    "Lặng lẽ quan sát Phương Nguyên và nhóm thiếu gia Mạc Bắc, Xích Thành rồi lui về Ký Túc Xá",
                    "Tiến tới chào hỏi Học Đường Gia Lão để gây ấn tượng tốt từ đầu",
                    "Bắt chuyện với Cổ Nguyệt Kim Châu hoặc Cổ Nguyệt Bằng để tìm hiểu tình hình khóa mới",
                ],
            }
        ]

        _save_json(os.path.join(rdir, "state.json"), state)
        _save_json(os.path.join(rdir, "npcs.json"), npcs_clone)
        _save_json(os.path.join(rdir, "timeline.json"), timeline_clone)
        _save_json(os.path.join(rdir, "rumors.json"), rumors)
        _save_json(os.path.join(rdir, "history.json"), history)

        return self.get_full_bundle(run_id)

    def load_bundle(self, run_id: str) -> Dict[str, Any]:
        rdir = self._run_dir(run_id)
        if not os.path.isdir(rdir):
            raise FileNotFoundError(f"Không tìm thấy lượt chơi {run_id}")
        return {
            "state": _load_json(os.path.join(rdir, "state.json")),
            "npcs": _load_json(os.path.join(rdir, "npcs.json")),
            "timeline": _load_json(os.path.join(rdir, "timeline.json")),
            "rumors": _load_json(os.path.join(rdir, "rumors.json")),
            "history": _load_json(os.path.join(rdir, "history.json")),
        }

    def save_bundle(self, run_id: str, bundle: Dict[str, Any]) -> None:
        rdir = self._run_dir(run_id)
        _save_json(os.path.join(rdir, "state.json"), bundle["state"])
        _save_json(os.path.join(rdir, "npcs.json"), bundle["npcs"])
        _save_json(os.path.join(rdir, "timeline.json"), bundle["timeline"])
        _save_json(os.path.join(rdir, "rumors.json"), bundle["rumors"])
        _save_json(os.path.join(rdir, "history.json"), bundle["history"])

    def get_full_bundle(self, run_id: str) -> Dict[str, Any]:
        bundle = self.load_bundle(run_id)
        st = bundle["state"]
        p = st["player"]
        clk = format_clock(st["day"], st["minute_of_day"])
        reminder = get_schedule_reminder(st["minute_of_day"], st["location"], st["schedule"])
        combat = compute_combat_power(p, self.econ_tpl)
        _, stage = get_realm_stage(p["rank"], p["sub_realm"], self.econ_tpl)

        # Build visible map info with current price & shortest travel time from player location
        zones_view = []
        for z in self.world_map_tpl["zones"]:
            if z.get("hidden") and z["id"] not in p.get("discovered_zones", []):
                continue
            path, travel_min = self.find_shortest_path(st["location"], z["id"], p.get("discovered_zones", []))
            zones_view.append({
                **z,
                "travel_minutes": travel_min,
                "path": path,
                "is_current": z["id"] == st["location"],
            })

        # Shop pricing with seasonal multiplier
        mult = st.get("price_multiplier", 1.0)
        shop_items = []
        for it in self.econ_tpl["shop_items"]:
            shop_items.append({
                **it,
                "price": max(1, int(round(it["base_price"] * mult))),
            })

        market_gu = []
        for entry in self.econ_tpl["market_gu_catalog"]:
            if entry["season_only"] and entry["season_only"] != clk["season"]:
                continue
            raw = self.gu_by_id.get(entry["gu_id"], {})
            market_gu.append({
                "id": entry["gu_id"],
                "name": _clean_gu_name(raw.get("ten_goi", entry["gu_id"])),
                "price": max(10, int(round(entry["base_price"] * mult))),
                "effect": raw.get("cong_nang_cu_the", "")[:180],
                "season_only": entry["season_only"],
            })

        score = self.calculate_run_score(bundle) if st["status"] != "active" else None

        return {
            "state": st,
            "clock": clk,
            "reminder": reminder,
            "combat": combat,
            "wall_required": stage["wall_required"],
            "npcs": bundle["npcs"],
            "timeline": bundle["timeline"],
            "rumors": bundle["rumors"],
            "history": bundle["history"][-60:],
            "map_zones": zones_view,
            "shop_items": shop_items,
            "market_gu": market_gu,
            "run_score": score,
        }

    def find_shortest_path(
        self, start: str, goal: str, discovered_zones: List[str]
    ) -> Tuple[List[str], int]:
        if start == goal:
            return [start], 0
        # Dijkstra-lite via BFS queue (small graph of 11 nodes)
        best_cost = {start: 0}
        parent: Dict[str, Optional[str]] = {start: None}
        q = deque([start])
        while q:
            u = q.popleft()
            uz = self.zones_by_id.get(u)
            if not uz:
                continue
            for v, mins in uz.get("neighbors", {}).items():
                vz = self.zones_by_id.get(v)
                if not vz:
                    continue
                if vz.get("hidden") and v not in discovered_zones:
                    continue
                nc = best_cost[u] + mins
                if v not in best_cost or nc < best_cost[v]:
                    best_cost[v] = nc
                    parent[v] = u
                    q.append(v)
        if goal not in best_cost:
            return [], -1
        path = []
        cur: Optional[str] = goal
        while cur is not None:
            path.append(cur)
            cur = parent[cur]
        path.reverse()
        return path, best_cost[goal]

    def roll_present_npcs(
        self, zone_id: str, minute_of_day: int, season: str, npcs: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Tung d100 thuần theo lịch trình canh giờ để xem NPC nào đang có mặt tại vùng."""
        canh = get_canh_gio(minute_of_day)
        scheds = self.schedules_tpl["schedules"]
        present = []
        for npc in npcs:
            if npc.get("status") not in ("alive", "injured"):
                continue
            if season not in npc.get("active_seasons", ["Xuân", "Hạ", "Thu", "Đông"]):
                continue
            prob = scheds.get(npc["id"], {}).get(zone_id, {}).get(canh, 0.0)
            if prob <= 0:
                continue
            r = random.randint(1, 100)
            if r <= int(prob * 100):
                present.append(npc)
        return present

    def advance_time(
        self, bundle: Dict[str, Any], minutes: int, silent: bool = False
    ) -> Dict[str, Any]:
        """
        Tăng thời gian thật (phút), xử lý:
        - Hồi chân nguyên tự nhiên theo 1% tư chất
        - Qua ngày mới: sinh hoạt phí, chu kỳ đói Cổ trùng, trợ cấp Học Đường hàng tuần, hỗ trợ gia đình
        - Kiểm tra trễ giờ Học Đường bắt buộc
        - Kiểm tra chạm mốc sự kiện Timeline Năm 1
        """
        st = bundle["state"]
        p = st["player"]
        logs: List[str] = []
        triggered_event: Optional[Dict[str, Any]] = None

        if minutes <= 0 or st["status"] != "active":
            return {"logs": logs, "triggered_event": None}

        old_day = st["day"]
        old_min = st["minute_of_day"]

        # Kiểm tra xem có vừa đi xuyên qua khung giờ học bắt buộc mà không có mặt ở hoc_duong không
        for blk in st["schedule"]:
            if blk.get("mandatory") and not blk.get("done"):
                if old_min < blk["end_minute"] and (old_min + minutes) >= blk["end_minute"]:
                    if st["location"] != blk["zone"] and blk["activity"] == "class":
                        blk["done"] = True
                        p["tardy_count"] += 1
                        fine = self.econ_tpl["academy"]["tardy_fine_stones"]
                        if p["stones"] >= fine:
                            p["stones"] -= fine
                        for n in bundle["npcs"]:
                            if n["id"] == "hoc_duong_gia_lao":
                                n["affinity"] = max(-100, n["affinity"] + self.econ_tpl["academy"]["absent_affinity_penalty"])
                        logs.append(
                            f"⚠️ Ngươi đã BỎ LỠ buổi Học Đường bắt buộc! Học Đường Gia Lão phạt -{fine} nguyên thạch và giảm thiện cảm."
                        )

        recover_essence_over_time(p, minutes, self.econ_tpl)

        total_min = st["minute_of_day"] + minutes
        days_added = total_min // 1440
        st["minute_of_day"] = total_min % 1440
        st["day"] = min(360, st["day"] + days_added)

        if days_added > 0:
            # Sinh hoạt phí mỗi ngày (0.2 nguyên thạch/ngày -> cứ đủ 1 nguyên thạch thì trừ)
            p["living_debt_fraction"] = round(
                p.get("living_debt_fraction", 0.0)
                + days_added * self.econ_tpl["living_costs"]["daily_food_cost"],
                2,
            )
            while p["living_debt_fraction"] >= 1.0:
                p["living_debt_fraction"] = round(p["living_debt_fraction"] - 1.0, 2)
                if p["stones"] >= 1:
                    p["stones"] -= 1
                    logs.append("🍚 Chi phí ăn uống sinh hoạt tích lũy: -1 nguyên thạch.")
                elif p["inventory"].get("luong_kho", 0) > 0:
                    p["inventory"]["luong_kho"] -= 1
                    logs.append("🥖 Hết tiền ăn — ngươi phải dùng 1 phần Lương Khô dự trữ.")
                else:
                    p["hp"] = max(1, p["hp"] - 8)
                    p["stamina"] = max(0, p["stamina"] - 20)
                    logs.append("🩸 Đói khát vì cạn nguyên thạch & lương khô! Sinh lực -8, Thể lực -20.")

            # Chu kỳ đói Cổ trùng
            hunger_alerts = tick_gu_hunger(p, days_added)
            logs.extend(hunger_alerts)

            # Trợ cấp Học Đường mỗi 7 ngày (sau ngày 3)
            if st["day"] >= 7 and (st["day"] - st.get("last_stipend_day", 0)) >= 7:
                st["last_stipend_day"] = st["day"]
                stipend = self.econ_tpl["academy"]["weekly_stipend_stones"]
                if p.get("paying_pn_extortion"):
                    stipend -= 1
                    logs.append(
                        f"💎 Nhận trợ cấp Học Đường tuần này (+3 nguyên thạch), nhưng bị Phương Nguyên chặn cổng thu phí bảo kê -1 → thực nhận +{stipend} nguyên thạch."
                    )
                else:
                    logs.append(f"💎 Nhận trợ cấp Học Đường tuần này: +{stipend} nguyên thạch.")
                p["stones"] += stipend

            # Hỗ trợ hàng tháng cho xuất thân Bố mẹ bình dân
            clk_now = format_clock(st["day"], st["minute_of_day"])
            if p["background"] == "commoner" and clk_now["month"] > st.get("last_family_support_month", 1):
                st["last_family_support_month"] = clk_now["month"]
                sup = self.econ_tpl["living_costs"]["commoner_monthly_family_support"]
                p["stones"] += sup
                logs.append(f"🏠 Cha mẹ gửi tiếp tế đầu tháng {clk_now['month']}: +{sup} nguyên thạch.")

            # Xây lại lịch trình ngày mới theo mục tiêu
            st["schedule"] = build_daily_schedule(st["goal"], st["day"], clk_now["season"])

        # Kiểm tra mốc sự kiện Timeline năm 1
        for ev in bundle["timeline"]:
            if not ev.get("triggered") and st["day"] >= ev["day"]:
                ev["triggered"] = True
                ev["status"] = "active"
                st["price_multiplier"] = max(st.get("price_multiplier", 1.0), ev.get("price_multiplier", 1.0))
                if ev["id"] == "giay_phep_san_ban":
                    p["has_hunt_permit"] = True
                if ev["id"] == "huong_ruou_hau_son" and "dong_hoa_tuu" not in p["discovered_zones"]:
                    p["discovered_zones"].append("dong_hoa_tuu")
                triggered_event = ev
                break

        if not silent and logs:
            clk_str = format_clock(st["day"], st["minute_of_day"])["short_display"]
            bundle["history"].append({
                "id": uuid.uuid4().hex[:8],
                "role": "system",
                "kind": "tick",
                "clock": clk_str,
                "text": "\n".join(logs),
            })

        return {"logs": logs, "triggered_event": triggered_event}

    def trigger_timeline_scene(self, bundle: Dict[str, Any], ev: Dict[str, Any]) -> Dict[str, Any]:
        """Kích hoạt cảnh sự kiện lớn trong Năm 1 (dời hoặc triệu tập nhân vật tới địa điểm sự kiện nếu bắt buộc)."""
        st = bundle["state"]
        p = st["player"]
        if ev.get("required"):
            st["location"] = ev["location"]
        clk = format_clock(st["day"], st["minute_of_day"])

        # Khởi tạo quà hoặc xử lý đặc trưng theo sự kiện
        extra_note = ""
        suggested = [
            "Quan sát tình hình và tìm cơ hội có lợi nhất cho bản thân",
            "Giữ thái độ khiêm nhường, tránh để phe phái lớn chú ý",
            "Chủ động bước lên đối thoại để thử thay đổi cục diện",
        ]

        if ev["id"] == "chon_ban_menh_co":
            if not p["gu_list"]:
                if p["aptitude_percent"] >= 40:
                    gu = self.make_gu_instance("GU_R1_01")
                    p["gu_list"].append(gu)
                    extra_note = "\n\n🎁 **Nhận Bản Mệnh Cổ:** `Nguyệt Quang Cổ` (đã ký sinh trong lòng bàn tay) + 3 nguyên thạch khởi đầu!"
                else:
                    gu = self.make_gu_instance("GU_R1_02")
                    p["gu_list"].append(gu)
                    extra_note = "\n\n🎁 **Tư chất Đinh đẳng** khó gánh Nguyệt Quang Cổ nên Học Đường cấp cho ngươi `Tiểu Quang Cổ` + 3 nguyên thạch khởi đầu!"
                p["stones"] += 3
            suggested = [
                "Dốc toàn lực thức trắng đêm mài giũa chân nguyên tranh hạng nhất luyện hóa Bản Mệnh Cổ (+15 nguyên thạch)",
                "Luyện hóa từ tốn an toàn, tiết kiệm nguyên thạch và quan sát Phương Nguyên",
                "Hỏi thăm Học Đường Gia Lão bí quyết luyện Cổ và tìm hiểu các học viên cùng khóa",
            ]
        elif ev["id"] == "tran_lot_hoc_duong":
            suggested = [
                "Cắn răng nộp 1 nguyên thạch/tuần cho Phương Nguyên để tránh gãy xương và giữ sức tu luyện",
                "Đứng ra chống cự trực diện với Phương Nguyên ngay trước cổng Học Đường!",
                "Âm thầm tìm đường vòng tránh cổng Học Đường hoặc đề nghị trao đổi tin tức với Phương Nguyên",
            ]
        elif ev["id"] == "khao_hach_ban_bia":
            suggested = [
                "Tập trung toàn bộ tinh thần phóng Nguyệt Nhận nhắm thẳng yếu hầu thảo nhân tranh hạng cao",
                "Phóng cầm chừng giữ sức, giấu bớt thực lực thực sự trước mặt các Gia lão",
                "Kết hợp Cổ phụ trợ để tạo ấn tượng mạnh với Gia lão Mạc Trần hoặc Xích Luyện",
            ]
        elif ev["id"] == "thuong_doi_co_phu":
            suggested = [
                "Tới sạp Đổ Thạch của Cổ Kim Sinh thử vận may chọn một hòn đá thô (10 nguyên thạch)",
                "Dạo quanh sạp Cổ trùng của thương đội Cổ Phú tìm mua Cổ phụ trợ quý",
                "Theo dõi từ xa xem Phương Nguyên đang mua thứ gì tại chợ phiên",
            ]
        elif ev["id"] == "vong_do_tu_vi":
            combat = compute_combat_power(p, self.econ_tpl)
            st["exam_round1_score"] = combat["total"]
            extra_note = (
                f"\n\n📊 **Kết quả đo Không Khiếu của ngươi:** "
                f"**{'Nhất' if p['rank']==1 else 'Nhị'} chuyển {p['sub_realm']}** "
                f"({combat['essence_color']}) — Chiến lực thẩm định: **{combat['total']} điểm**."
            )
            suggested = [
                "Bình tĩnh đón nhận ánh mắt đánh giá của Hội đồng Gia lão và chuẩn bị cho vòng Lôi Đài",
                "Cố tình che giấu bớt át chủ bài Cổ trùng khi nữ Cổ sư kiểm tra Không Khiếu",
                "Quan sát sát sao biểu hiện của Phương Nguyên, Phương Chính, Mạc Bắc và Xích Thành",
            ]
        elif ev["id"] == "dai_hoi_loi_dai":
            suggested = [
                "Dốc toàn bộ chân nguyên và Cổ trùng đánh hết mình trên Lôi Đài tranh ngôi đầu bảng!",
                "Dùng chiến thuật né tránh kéo dài khiến đối thủ cạn chân nguyên rồi phản công hiểm hóc",
                "Đánh vừa đủ vào nhóm khá để nhận thưởng an toàn, tránh bị Tộc trưởng Cổ Nguyệt Bác thử thăm dò",
            ]

        st["active_scene"] = {
            "in_scene": True,
            "title": ev["title"],
            "trigger_type": "timeline",
            "event_id": ev["id"],
            "present_npcs": [
                nid for nid in ev["npcs_involved"]
                if any(n["id"] == nid and n["status"] != "dead" for n in bundle["npcs"])
            ],
            "publicity": "công khai" if ev["location"] in ("hoc_duong", "quang_truong", "tu_duong") else "bán công khai / hoang dã",
            "scene_turns": 0,
            "summary_notes": [ev["canon_summary"]],
        }

        text = (
            f"### 📜 BIẾN CỐ NĂM THỨ NHẤT: {ev['title'].upper()}\n"
            f"{ev['canon_summary']}\n\n"
            f"*{ev['gameplay_effect']}*{extra_note}\n\n"
            f"**Trước cục diện này, ngươi quyết định hành động thế nào?**"
        )
        bundle["history"].append({
            "id": uuid.uuid4().hex[:8],
            "role": "gm",
            "kind": "timeline",
            "clock": clk["short_display"],
            "title": ev["title"],
            "text": text,
            "suggested_actions": suggested,
        })
        return ev

    def move_to_zone(self, run_id: str, target_zone_id: str) -> Dict[str, Any]:
        """
        Di chuyển từng bước qua các vùng trên bản đồ Thanh Mao Sơn.
        Mỗi vùng đi qua: cộng thời gian di chuyển thật + tung d100 kiểm tra gặp NPC / biến cố!
        """
        bundle = self.load_bundle(run_id)
        st = bundle["state"]
        p = st["player"]
        if st["status"] != "active":
            return {"error": "Lượt chơi đã kết thúc.", "bundle": self.get_full_bundle(run_id)}

        path, total_mins = self.find_shortest_path(st["location"], target_zone_id, p["discovered_zones"])
        if not path or len(path) < 2:
            return {"error": "Ngươi đang ở đúng địa điểm này hoặc đường đi chưa mở khóa.", "bundle": self.get_full_bundle(run_id)}

        # Nếu đang rời khỏi một cảnh, tự đóng cảnh trước
        st["active_scene"]["in_scene"] = False

        step_logs = []
        interrupted_by = None

        for i in range(1, len(path)):
            prev_z = path[i - 1]
            cur_z = path[i]
            edge_min = self.zones_by_id[prev_z]["neighbors"][cur_z]
            st["location"] = cur_z

            tick = self.advance_time(bundle, edge_min, silent=True)
            clk = format_clock(st["day"], st["minute_of_day"])
            zone_obj = self.zones_by_id[cur_z]
            step_logs.append(f"👣 Đi qua **{zone_obj['short_name']}** (+{edge_min} phút → {clk['time_str']})")
            step_logs.extend(tick["logs"])

            # Ưu tiên 1: Trúng mốc sự kiện lớn
            if tick["triggered_event"]:
                interrupted_by = "timeline"
                self.trigger_timeline_scene(bundle, tick["triggered_event"])
                break

            # Ưu tiên 2: Tung d100 lịch trình NPC tại vùng vừa đi qua
            present_npcs = self.roll_present_npcs(cur_z, st["minute_of_day"], clk["season"], bundle["npcs"])
            # Xác suất kích hoạt biến cố trên đường (dựa trên độ nguy hiểm vùng + có NPC nổi bật)
            encounter_chance = zone_obj.get("ambient_danger", 10) + (18 if present_npcs else 0)
            enc_roll = random.randint(1, 100)
            is_final_dest = (i == len(path) - 1)

            if present_npcs and (enc_roll <= encounter_chance or is_final_dest):
                picked = present_npcs[:2]
                npc_names = ", ".join(n["name"] for n in picked)
                st["active_scene"] = {
                    "in_scene": True,
                    "title": f"Chạm mặt tại {zone_obj['short_name']}",
                    "trigger_type": "encounter",
                    "event_id": None,
                    "present_npcs": [n["id"] for n in picked],
                    "publicity": "công khai" if cur_z in ("hoc_duong", "quang_truong", "khu_pho", "tu_duong") else "vắng vẻ / kín đáo",
                    "scene_turns": 0,
                    "summary_notes": [f"Gặp {npc_names} tại {zone_obj['name']}"],
                }
                interrupted_by = "encounter"
                reminder = get_schedule_reminder(st["minute_of_day"], cur_z, st["schedule"])
                remind_line = f"\n\n_{reminder['message']}_" if reminder["severity"] != "normal" else ""
                npc_desc = "\n".join(
                    f"- **{n['name']}** ({n['rank']} | Thiện cảm: {n['affinity']} | Ấn tượng: *{n['impression']}*)"
                    for n in picked
                )
                bundle["history"].append({
                    "id": uuid.uuid4().hex[:8],
                    "role": "gm",
                    "kind": "encounter",
                    "clock": clk["short_display"],
                    "title": f"Gặp gỡ tại {zone_obj['name']}",
                    "text": (
                        f"Trên đường đặt chân tới **{zone_obj['name']}** (Giờ {clk['canh_gio']} khắc {clk['khac']}), "
                        f"ngươi chạm mặt:\n{npc_desc}\n\n"
                        f"{zone_obj['description']}{remind_line}\n\n"
                        f"**Ngươi muốn bắt chuyện, dò la, giao dịch, hay lặng lẽ lách qua?**"
                    ),
                    "suggested_actions": [
                        f"Tiến tới chào hỏi và dò hỏi tin tức từ {picked[0]['name']}",
                        f"Giữ khoảng cách, lặng lẽ quan sát hành tung của {picked[0]['name']}",
                        "Cáo từ đi tiếp cho kịp lịch trình trong ngày",
                    ],
                })
                break

        if step_logs:
            clk_end = format_clock(st["day"], st["minute_of_day"])
            bundle["history"].append({
                "id": uuid.uuid4().hex[:8],
                "role": "system",
                "kind": "travel",
                "clock": clk_end["short_display"],
                "text": "\n".join(step_logs),
            })

        self.save_bundle(run_id, bundle)
        return {
            "interrupted_by": interrupted_by,
            "bundle": self.get_full_bundle(run_id),
        }

    def run_schedule(self, run_id: str, mode: str = "block") -> Dict[str, Any]:
        """
        Code thuần tự chạy nền theo lịch trình (0 tốn token AI!).
        mode = 'block' (1 khối lịch), 'day' (hết ngày), 'week' (tua tới 7 ngày hoặc dừng khi có biến).
        """
        bundle = self.load_bundle(run_id)
        st = bundle["state"]
        p = st["player"]
        if st["status"] != "active":
            return {"error": "Lượt chơi đã kết thúc.", "bundle": self.get_full_bundle(run_id)}

        max_blocks = 1 if mode == "block" else (6 if mode == "day" else 35)
        summary_lines: List[str] = []
        interrupted_reason: Optional[str] = None
        st["active_scene"]["in_scene"] = False

        for _ in range(max_blocks):
            if st["status"] != "active":
                break
            # Tìm khối lịch kế tiếp chưa làm
            next_blk = None
            for blk in st["schedule"]:
                if not blk.get("done"):
                    next_blk = blk
                    break

            if not next_blk:
                # Chuyển sang 05:30 sáng hôm sau
                mins_to_morning = (1440 - st["minute_of_day"]) + 330
                tick = self.advance_time(bundle, mins_to_morning, silent=True)
                p["stamina"] = min(p["max_stamina"], p["stamina"] + 45)
                p["hp"] = min(p["max_hp"], p["hp"] + 6)
                summary_lines.extend(tick["logs"])
                if tick["triggered_event"]:
                    interrupted_reason = f"Biến cố: {tick['triggered_event']['title']}"
                    self.trigger_timeline_scene(bundle, tick["triggered_event"])
                    break
                continue

            # Nếu chưa tới giờ khối lịch, tua tới start_minute
            if st["minute_of_day"] < next_blk["start_minute"]:
                wait_m = next_blk["start_minute"] - st["minute_of_day"]
                tick = self.advance_time(bundle, wait_m, silent=True)
                summary_lines.extend(tick["logs"])
                if tick["triggered_event"]:
                    interrupted_reason = f"Biến cố: {tick['triggered_event']['title']}"
                    self.trigger_timeline_scene(bundle, tick["triggered_event"])
                    break

            # Tự đi tới vùng lịch trình (nếu chưa ở đó)
            if st["location"] != next_blk["zone"]:
                path, tmin = self.find_shortest_path(st["location"], next_blk["zone"], p["discovered_zones"])
                if tmin > 0:
                    st["location"] = next_blk["zone"]
                    tick = self.advance_time(bundle, tmin, silent=True)
                    summary_lines.extend(tick["logs"])
                    if tick["triggered_event"]:
                        interrupted_reason = f"Biến cố: {tick['triggered_event']['title']}"
                        self.trigger_timeline_scene(bundle, tick["triggered_event"])
                        break

            # Kiểm tra Cổ trùng sắp chết đói -> dừng ngay cảnh báo
            starving_gu = [g for g in p["gu_list"] if g.get("days_until_hungry", 9) <= 1 and g.get("feed_interval_days", 8) < 900]
            if starving_gu and mode != "block":
                interrupted_reason = f"Cổ trùng {starving_gu[0]['name']} sắp chết đói!"
                summary_lines.append(f"🛑 Dừng lịch trình: **{starving_gu[0]['name']}** cần cho ăn [{starving_gu[0]['food_name']}] ngay!")
                break

            # Thực thi nội dung khối lịch bằng Code thuần
            dur = max(30, next_blk["end_minute"] - max(st["minute_of_day"], next_blk["start_minute"]))
            act = next_blk["activity"]
            clk_before = format_clock(st["day"], st["minute_of_day"])
            zone_obj = self.zones_by_id[st["location"]]

            if act == "class":
                p["attendance_score"] += 1
                p["combat_skill"] = min(100, p["combat_skill"] + 1)
                res = nurture_aperture(p, int(dur * 0.4), False, self.econ_tpl, 1.0)
                line = f"📚 [{clk_before['short_display']}] Lên Học Đường đầy đủ (+1 Chuyên cần, +{res['wall_gain']} tiến độ vách không khiếu)."
                if res["broke_through"]:
                    line += f" ✨ **ĐỘT PHÁ: {res['new_realm_label'].upper()}!**"
                summary_lines.append(line)
            elif act in ("cultivate", "cultivate_light"):
                use_st = (act == "cultivate" and p["stones"] >= 4)
                res = nurture_aperture(p, dur, use_st, self.econ_tpl, zone_obj["cultivation_bonus"])
                line = (
                    f"🧘 [{clk_before['short_display']}] Ôn dưỡng Không Khiếu ({dur}p"
                    f"{', dùng ' + str(res['stones_spent']) + ' nguyên thạch' if res['stones_spent'] else ''}): "
                    f"+{res['wall_gain']} tiến độ vách."
                )
                if res["broke_through"]:
                    line += f" ✨ **ĐỘT PHÁ: {res['new_realm_label'].upper()}!**"
                summary_lines.append(line)
            elif act == "work":
                earn = random.randint(1, 2) if p["stamina"] >= 20 else 1
                p["stones"] += earn
                p["stamina"] = max(0, p["stamina"] - 18)
                summary_lines.append(
                    f"💼 [{clk_before['short_display']}] Làm việc tại {zone_obj['short_name']}: kiếm +{earn} nguyên thạch (Thể lực -18)."
                )
            elif act == "hunt":
                r = roll_d100(55 - min(20, p["combat_skill"] // 3))
                p["stamina"] = max(0, p["stamina"] - 28)
                if r["delta"] >= 0:
                    earn = random.randint(2, 4)
                    p["stones"] += earn
                    p["inventory"]["thit_heo_rung"] = p["inventory"].get("thit_heo_rung", 0) + 1
                    p["combat_skill"] = min(100, p["combat_skill"] + 2)
                    summary_lines.append(
                        f"🐗 [{clk_before['short_display']}] Săn bắn Rừng Trúc (d100={r['player_roll']}/{r['target']}): thu +{earn} nguyên thạch, +1 Thịt Heo Rừng, +2 Thực chiến!"
                    )
                else:
                    dmg = random.randint(6, 16)
                    p["hp"] = max(1, p["hp"] - dmg)
                    summary_lines.append(
                        f"🩸 [{clk_before['short_display']}] Săn bắn Rừng Trúc gặp heo rừng húc (d100={r['player_roll']}/{r['target']}): Sinh lực -{dmg}!"
                    )
            elif act == "train":
                p["combat_skill"] = min(100, p["combat_skill"] + 2)
                p["stamina"] = max(0, p["stamina"] - 15)
                if any(g["id"] in ("GU_R1_06", "GU_R1_07") for g in p["gu_list"]) and p["boar_strength"] < 1.0:
                    p["boar_strength"] = round(min(1.0, p["boar_strength"] + 0.08), 2)
                    summary_lines.append(
                        f"💪 [{clk_before['short_display']}] Luyện thể kết hợp Thỉ Cổ tại Võ Trường: +2 Thực chiến, Khí lực tăng lên {p['boar_strength']} Trư lực!"
                    )
                else:
                    summary_lines.append(
                        f"⚔️ [{clk_before['short_display']}] Tập bắn Nguyệt Nhận & thân pháp tại Võ Trường: +2 Thực chiến."
                    )
            elif act == "socialize":
                p["luck"] = max(-100, min(100, p["luck"] + random.choice([0, 1])))
                summary_lines.append(
                    f"🍶 [{clk_before['short_display']}] Dạo quanh {zone_obj['short_name']} nghe ngóng tình hình sơn trại."
                )
            elif act == "rest":
                p["stamina"] = min(p["max_stamina"], p["stamina"] + 50)
                p["hp"] = min(p["max_hp"], p["hp"] + 8)
                summary_lines.append(f"🌙 [{clk_before['short_display']}] Nghỉ ngơi hồi phục Thể lực & Sinh lực.")
            else:
                summary_lines.append(f"⏳ [{clk_before['short_display']}] Hoàn thành: {next_blk['title']}.")

            next_blk["done"] = True
            tick = self.advance_time(bundle, dur, silent=True)
            summary_lines.extend(tick["logs"])

            if tick["triggered_event"]:
                interrupted_reason = f"Biến cố: {tick['triggered_event']['title']}"
                self.trigger_timeline_scene(bundle, tick["triggered_event"])
                break

            # Kiểm tra ngẫu nhiên gặp NPC nổi bật trong khối lịch (18% cơ hội ngắt để tạo kịch tính)
            clk_after = format_clock(st["day"], st["minute_of_day"])
            if act in ("class", "work", "socialize", "hunt") and random.randint(1, 100) <= 18:
                present = self.roll_present_npcs(st["location"], st["minute_of_day"], clk_after["season"], bundle["npcs"])
                if present:
                    npc = random.choice(present)
                    interrupted_reason = f"Gặp gỡ bất ngờ: {npc['name']}"
                    st["active_scene"] = {
                        "in_scene": True,
                        "title": f"Biến cố bất ngờ cùng {npc['name']}",
                        "trigger_type": "random_encounter",
                        "event_id": None,
                        "present_npcs": [npc["id"]],
                        "publicity": "công khai" if st["location"] in ("hoc_duong", "quang_truong", "khu_pho") else "vắng vẻ",
                        "scene_turns": 0,
                        "summary_notes": [f"Chạm mặt {npc['name']} khi đang {next_blk['title'].lower()}"],
                    }
                    bundle["history"].append({
                        "id": uuid.uuid4().hex[:8],
                        "role": "gm",
                        "kind": "encounter",
                        "clock": clk_after["short_display"],
                        "title": f"Biến cố tại {zone_obj['short_name']} — {npc['name']}",
                        "text": (
                            f"Đang lúc **{next_blk['title'].lower()}** tại **{zone_obj['name']}**, "
                            f"bước chân của ngươi bị chặn lại bởi **{npc['name']}** ({npc['title']}, thiện cảm hiện tại: {npc['affinity']}).\n\n"
                            f"Ánh mắt đối phương mang theo vẻ đánh giá (*ấn tượng: {npc['impression']}*). "
                            f"Với thân phận và mục tiêu hiện tại của y (*{npc['current_goal']}*), cuộc chạm mặt này không hẳn là vô cớ.\n\n"
                            f"**Ngươi ứng phó thế nào?**"
                        ),
                        "suggested_actions": [
                            f"Chủ động mở lời thăm dò ý định của {npc['name']}",
                            "Giữ nét mặt bình thản, tìm cớ cáo lui tránh rắc rối",
                            "Đưa ra một đề nghị trao đổi lợi ích / thông tin",
                        ],
                    })
                    break

        if summary_lines:
            clk_now = format_clock(st["day"], st["minute_of_day"])
            bundle["history"].append({
                "id": uuid.uuid4().hex[:8],
                "role": "system",
                "kind": "routine",
                "clock": clk_now["short_display"],
                "text": "\n".join(summary_lines[-16:]),
            })

        self.save_bundle(run_id, bundle)
        return {
            "interrupted_reason": interrupted_reason,
            "bundle": self.get_full_bundle(run_id),
        }

    def quick_action(self, run_id: str, action: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Các hành động xác định bằng Code thuần (tu luyện, cho Cổ ăn, mua hàng, đổ thạch, chữa thương, đổi mục tiêu)."""
        bundle = self.load_bundle(run_id)
        st = bundle["state"]
        p = st["player"]
        if st["status"] != "active":
            return {"error": "Lượt chơi đã kết thúc.", "bundle": self.get_full_bundle(run_id)}

        clk = format_clock(st["day"], st["minute_of_day"])
        zone_obj = self.zones_by_id[st["location"]]
        msg = ""

        if action == "set_goal":
            goal_text = str(payload.get("goal", "")).strip()
            if not goal_text:
                return {"error": "Vui lòng nhập mục tiêu.", "bundle": self.get_full_bundle(run_id)}
            st["goal"] = goal_text
            st["schedule"] = build_daily_schedule(goal_text, st["day"], clk["season"])
            msg = f"🎯 Đã cập nhật mục tiêu mới: **\"{goal_text}\"** — Lịch trình trong ngày đã được điều chỉnh phù hợp."

        elif action == "cultivate":
            minutes = max(30, min(240, int(payload.get("minutes", 120))))
            use_stones = bool(payload.get("use_stones", True))
            res = nurture_aperture(p, minutes, use_stones, self.econ_tpl, zone_obj["cultivation_bonus"])
            tick = self.advance_time(bundle, minutes, silent=True)
            msg = (
                f"🧘 Ôn dưỡng vách Không Khiếu trong **{minutes} phút** tại {zone_obj['short_name']} "
                f"(tiêu hao {res['stones_spent']} nguyên thạch): tiến độ vách **+{res['wall_gain']}**."
            )
            if res["broke_through"]:
                msg += f"\n✨ **CHẤN ĐỘNG KHÔNG KHIẾU — ĐỘT PHÁ LÊN {res['new_realm_label'].upper()}!**"
            if tick["logs"]:
                msg += "\n" + "\n".join(tick["logs"])
            if tick["triggered_event"]:
                self.trigger_timeline_scene(bundle, tick["triggered_event"])

        elif action == "feed_gu":
            idx = int(payload.get("gu_index", 0))
            if idx < 0 or idx >= len(p["gu_list"]):
                return {"error": "Không tìm thấy Cổ trùng.", "bundle": self.get_full_bundle(run_id)}
            gu = p["gu_list"][idx]
            fid = gu.get("food_id")
            if not fid:
                return {"error": "Cổ trùng này không cần cho ăn.", "bundle": self.get_full_bundle(run_id)}
            used = None
            if p["inventory"].get(fid, 0) > 0:
                p["inventory"][fid] -= 1
                used = gu["food_name"]
            elif p["inventory"].get("mat_dong_thao_duoc", 0) > 0:
                p["inventory"]["mat_dong_thao_duoc"] -= 1
                used = "Gói Thức Ăn Cổ Tổng Hợp"
            else:
                return {"error": f"Túi đồ không còn [{gu['food_name']}]! Hãy tới Khu Phố/Dược Đường mua.", "bundle": self.get_full_bundle(run_id)}
            gu["days_until_hungry"] = gu["feed_interval_days"]
            gu["starving"] = False
            msg = f"🪲 Đã cho **{gu['name']}** ăn `{used}` → no đủ trong **{gu['feed_interval_days']} ngày** tới!"

        elif action == "buy_item":
            item_id = payload.get("item_id")
            item = next((i for i in self.econ_tpl["shop_items"] if i["id"] == item_id), None)
            if not item:
                return {"error": "Vật phẩm không tồn tại.", "bundle": self.get_full_bundle(run_id)}
            price = max(1, int(round(item["base_price"] * st.get("price_multiplier", 1.0))))
            if p["stones"] < price:
                return {"error": f"Không đủ nguyên thạch (cần {price}, đang có {p['stones']}).", "bundle": self.get_full_bundle(run_id)}
            p["stones"] -= price
            if item["category"] == "medicine":
                p["hp"] = min(p["max_hp"], p["hp"] + item.get("heal_hp", 35))
                msg = f"💊 Mua & dùng **{item['name']}** (-{price} nguyên thạch) → Sinh lực hồi thành {p['hp']}/{p['max_hp']}."
            else:
                p["inventory"][item_id] = p["inventory"].get(item_id, 0) + 1
                msg = f"🛒 Đã mua **{item['name']}** (-{price} nguyên thạch)."

        elif action == "buy_gu":
            gu_id = payload.get("gu_id")
            entry = next((g for g in self.econ_tpl["market_gu_catalog"] if g["gu_id"] == gu_id), None)
            if not entry:
                return {"error": "Cổ trùng này không có bày bán.", "bundle": self.get_full_bundle(run_id)}
            price = max(10, int(round(entry["base_price"] * st.get("price_multiplier", 1.0))))
            if p["stones"] < price:
                return {"error": f"Không đủ nguyên thạch (cần {price}, đang có {p['stones']}).", "bundle": self.get_full_bundle(run_id)}
            p["stones"] -= price
            gu_inst = self.make_gu_instance(gu_id)
            p["gu_list"].append(gu_inst)
            self.advance_time(bundle, 30, silent=True)
            msg = f"🪲 Đã mua và luyện hóa **{gu_inst['name']}** (-{price} nguyên thạch, tốn 2 khắc)!"

        elif action == "gamble_stone":
            if clk["season"] != "Hạ" or st["day"] < 135:
                return {"error": "Sạp Đổ Thạch chỉ mở khi Thương đội Cổ Phú tới Quảng Trường vào Mùa Hạ (từ ngày 135)!", "bundle": self.get_full_bundle(run_id)}
            cost = 10
            if p["stones"] < cost:
                return {"error": "Cần ít nhất 10 nguyên thạch để mua 1 khối đá thô Đổ Thạch.", "bundle": self.get_full_bundle(run_id)}
            p["stones"] -= cost
            target = max(45, 72 - int(p["luck"] * 0.25))
            r = roll_d100(target)
            self.advance_time(bundle, 20, silent=True)
            if r["delta"] >= 20:
                prize_gu = self.make_gu_instance("GU_R1_22")
                p["gu_list"].append(prize_gu)
                msg = f"🎲 **ĐỔ THẠCH ĐẠI THẮNG!** (d100={r['player_roll']}/{r['target']}) Cắt đá lộ ra **Tửu Trùng** cực phẩm ngay trước ánh mắt kinh ngạc của Cổ Kim Sinh! (Đã thu vào Không Khiếu)"
            elif r["delta"] >= 0:
                gain = random.randint(25, 45)
                p["stones"] += gain
                msg = f"🎲 **Đổ Thạch trúng thưởng!** (d100={r['player_roll']}/{r['target']}) Cắt ra mảnh Cổ trùng tàn phế nhưng vẫn bán lại được +{gain} nguyên thạch!"
            else:
                msg = f"🪨 **Đổ Thạch trắng tay!** (d100={r['player_roll']}/{r['target']}) Khối đá chỉ là đá vụn rỗng tuếch — mất toi 10 nguyên thạch."

        elif action == "heal":
            cost = max(2, int(round(3 * st.get("price_multiplier", 1.0))))
            if p["stones"] < cost:
                return {"error": f"Dược Đường thu {cost} nguyên thạch tiền chữa thương.", "bundle": self.get_full_bundle(run_id)}
            p["stones"] -= cost
            p["hp"] = p["max_hp"]
            self.advance_time(bundle, 30, silent=True)
            msg = f"🏥 Trị thương tại Dược Đường (-{cost} nguyên thạch, 30 phút) → Sinh lực hồi đầy {p['hp']}/{p['max_hp']}."

        elif action == "rest":
            hours = max(1, min(8, int(payload.get("hours", 2))))
            tick = self.advance_time(bundle, hours * 60, silent=True)
            p["stamina"] = min(p["max_stamina"], p["stamina"] + hours * 16)
            p["hp"] = min(p["max_hp"], p["hp"] + hours * 3)
            msg = f"🛏️ Nghỉ ngơi {hours} giờ → Thể lực {p['stamina']}/{p['max_stamina']}, Sinh lực {p['hp']}/{p['max_hp']}."
            if tick["logs"]:
                msg += "\n" + "\n".join(tick["logs"])
            if tick["triggered_event"]:
                self.trigger_timeline_scene(bundle, tick["triggered_event"])

        else:
            return {"error": f"Hành động không hỗ trợ: {action}", "bundle": self.get_full_bundle(run_id)}

        bundle["history"].append({
            "id": uuid.uuid4().hex[:8],
            "role": "system",
            "kind": "action",
            "clock": format_clock(st["day"], st["minute_of_day"])["short_display"],
            "text": msg,
        })
        self.save_bundle(run_id, bundle)
        return {"message": msg, "bundle": self.get_full_bundle(run_id)}

    def apply_turn_effects(self, bundle: Dict[str, Any], effects: Dict[str, Any]) -> List[str]:
        """Hàm thuần kẹp biên độ áp dụng biến đổi trạng thái từ GM + kiểm tra Permadeath."""
        st = bundle["state"]
        p = st["player"]
        notes: List[str] = []

        hp_d = int(effects.get("hp_delta", 0))
        if hp_d != 0:
            p["hp"] = max(0, min(p["max_hp"], p["hp"] + hp_d))
            notes.append(f"Sinh lực {'+' if hp_d > 0 else ''}{hp_d}")

        st_d = int(effects.get("stones_delta", 0))
        if st_d != 0:
            p["stones"] = max(0, p["stones"] + st_d)
            notes.append(f"Nguyên thạch {'+' if st_d > 0 else ''}{st_d}")

        ess_d = float(effects.get("essence_delta", 0.0))
        if ess_d != 0:
            p["essence_thanh"] = round(max(0.0, min(p["max_thanh"], p["essence_thanh"] + ess_d)), 2)
            notes.append(f"Chân nguyên {'+' if ess_d > 0 else ''}{ess_d} thành")

        rep_d = int(effects.get("reputation_delta", 0))
        if rep_d != 0:
            p["reputation"] = max(-100, min(100, p["reputation"] + rep_d))
            notes.append(f"Danh tiếng {'+' if rep_d > 0 else ''}{rep_d}")

        luck_d = int(effects.get("luck_delta", 0))
        if luck_d != 0:
            p["luck"] = max(-100, min(100, p["luck"] + luck_d))
            notes.append(f"Khí vận {'+' if luck_d > 0 else ''}{luck_d}")

        skill_d = int(effects.get("combat_skill_delta", 0))
        if skill_d != 0:
            p["combat_skill"] = max(0, min(100, p["combat_skill"] + skill_d))
            notes.append(f"Thực chiến {'+' if skill_d > 0 else ''}{skill_d}")

        grant_gu = effects.get("grant_gu_id")
        if grant_gu and grant_gu in self.gu_by_id:
            gu_inst = self.make_gu_instance(grant_gu)
            p["gu_list"].append(gu_inst)
            notes.append(f"Thu được Cổ trùng: {gu_inst['name']}")

        unlock_zone = effects.get("unlock_zone")
        if unlock_zone and unlock_zone in self.zones_by_id and unlock_zone not in p["discovered_zones"]:
            p["discovered_zones"].append(unlock_zone)
            notes.append(f"Mở khóa vùng bí mật: {self.zones_by_id[unlock_zone]['name']}")

        if effects.get("paying_pn_extortion") is True:
            p["paying_pn_extortion"] = True
            notes.append("Chấp nhận nộp phí bảo kê 1 nguyên thạch/tuần cho Phương Nguyên")
        elif effects.get("defied_pn") is True:
            p["defied_pn"] = True
            p["paying_pn_extortion"] = False
            notes.append("Công khai đối đầu Phương Nguyên tại cổng Học Đường")

        # Kiểm tra Permadeath (Chết là hết!)
        if p["hp"] <= 0 or effects.get("fatal_death"):
            p["hp"] = 0
            st["status"] = "dead"
            st["death_reason"] = effects.get("death_reason") or "Trọng thương tử vong trong năm đầu tại Thanh Mao Sơn."
            notes.append("💀 SINH MỆNH ĐÃ CHẤM DỨT (PERMADEATH)")

        # Kiểm tra kết thúc Đại Hội Sát Hạch cuối năm
        if effects.get("complete_year1"):
            st["status"] = "completed"
            st["exam_final_rank"] = effects.get("exam_final_rank") or "Top 10 Khóa Mới"
            st["assigned_squad"] = effects.get("assigned_squad") or "Tiểu tổ Cổ Nguyệt"
            notes.append(f"🏆 HOÀN TẤT NĂM THỨ NHẤT — Hạng: {st['exam_final_rank']}")

        return notes

    def apply_scene_impacts(self, bundle: Dict[str, Any], impact_data: Dict[str, Any]) -> List[str]:
        """
        Cơ chế Câu 6: Cập nhật những NPC thực sự bị ảnh hưởng sâu sắc,
        và dựa trên tính cách + thân phận + bối cảnh để kích hoạt có điều kiện:
        - A: Lan truyền 1 tầng sang close_contacts
        - C: Tin đồn sơn trại (village_rumors)
        """
        st = bundle["state"]
        clk = format_clock(st["day"], st["minute_of_day"])
        npcs_by_id = {n["id"]: n for n in bundle["npcs"]}
        summary_lines: List[str] = []

        for item in impact_data.get("impacted_npcs", []):
            nid = item.get("npc_id")
            npc = npcs_by_id.get(nid)
            if not npc:
                continue
            aff_d = int(item.get("affinity_delta", 0))
            npc["affinity"] = max(-100, min(100, npc["affinity"] + aff_d))
            if item.get("new_impression"):
                npc["impression"] = str(item["new_impression"])[:80]
            if item.get("new_goal"):
                npc["current_goal"] = str(item["new_goal"])[:180]
            if item.get("new_status") in ("alive", "injured", "dead", "missing"):
                npc["status"] = item["new_status"]
            mem = str(item.get("new_memory", "")).strip()
            if mem:
                npc["memories"].append(f"[N{st['day']}/Mùa {clk['season']}] {mem}")
                npc["memories"] = npc["memories"][-10:]  # Giữ 10 ký ức cốt lõi nhất
            st["deep_impacts_count"] = st.get("deep_impacts_count", 0) + 1
            summary_lines.append(
                f"🎭 **{npc['name']}** chịu tác động sâu (Thiện cảm {'+' if aff_d>=0 else ''}{aff_d} → {npc['affinity']}; Ấn tượng: *{npc['impression']}*)."
            )

        # Cơ chế A (Có điều kiện): Lan truyền sang close_contacts
        for prop in impact_data.get("propagations", []):
            cid = prop.get("contact_id")
            contact = npcs_by_id.get(cid)
            if not contact:
                continue
            aff_d = int(prop.get("affinity_delta", 0))
            contact["affinity"] = max(-100, min(100, contact["affinity"] + aff_d))
            note = str(prop.get("heard_version", "")).strip()
            if note:
                contact["memories"].append(f"[N{st['day']} - Nghe tin] {note}")
                contact["memories"] = contact["memories"][-10:]
            summary_lines.append(
                f"🕸️ **[Lan truyền thân cận]** {contact['name']} biết tin: *\"{note}\"* (Thiện cảm {'+' if aff_d>=0 else ''}{aff_d})."
            )

        # Cơ chế C (Có điều kiện): Tin đồn sơn trại
        rumor_text = str(impact_data.get("new_rumor", "") or "").strip()
        if rumor_text:
            bundle["rumors"].insert(0, {"day": st["day"], "text": rumor_text})
            bundle["rumors"] = bundle["rumors"][:8]
            summary_lines.append(f"📢 **[Tin đồn sơn trại]** *\"{rumor_text}\"*")

        return summary_lines

    def calculate_run_score(self, bundle: Dict[str, Any]) -> Dict[str, Any]:
        """Hệ thống tính điểm tổng kết lượt chơi (Run Scoring System)."""
        st = bundle["state"]
        p = st["player"]
        combat = compute_combat_power(p, self.econ_tpl)

        survival_pts = int((st["day"] / 360.0) * 300)
        if st["status"] == "completed":
            survival_pts += 200
        realm_pts = combat["base_realm"] * 4
        gu_pts = len(p["gu_list"]) * 45
        wealth_pts = min(200, int(p["stones"] * 1.2))
        butterfly_pts = st.get("deep_impacts_count", 0) * 25 + len(bundle["rumors"]) * 15
        boldness_pts = (80 if p.get("defied_pn") else 0) + int(p["boar_strength"] * 100)

        raw_total = survival_pts + realm_pts + gu_pts + wealth_pts + butterfly_pts + boldness_pts
        final_score = int(raw_total * p.get("difficulty_multiplier", 1.0))

        if st["status"] == "dead":
            grade = "Vẫn Lạc (Chết Non)"
        elif final_score >= 1300:
            grade = "S — Ma Đạo Cự Phách Tương Lai"
        elif final_score >= 950:
            grade = "A — Tinh Anh Cổ Nguyệt"
        elif final_score >= 650:
            grade = "B — Cổ Sư Đứng Vững"
        else:
            grade = "C — Tộc Nhân Sống Sót"

        return {
            "final_score": final_score,
            "grade": grade,
            "difficulty_multiplier": p.get("difficulty_multiplier", 1.0),
            "breakdown": {
                "Sinh tồn & Ngày tháng": survival_pts,
                "Cảnh giới Tu vi": realm_pts,
                "Bộ sưu tập Cổ trùng": gu_pts,
                "Tích lũy Nguyên thạch": wealth_pts,
                "Hiệu ứng Cánh bướm (NPC & Tin đồn)": butterfly_pts,
                "Bản lĩnh & Khí lực": boldness_pts,
            },
            "status": st["status"],
            "death_reason": st.get("death_reason"),
            "exam_final_rank": st.get("exam_final_rank"),
            "assigned_squad": st.get("assigned_squad"),
        }
