# -*- coding: utf-8 -*-
"""
Mô phỏng sâu hệ thống Tu Luyện, Không Khiếu, Thanh Đồng / Xích Thiết Chân Nguyên và Nuôi Cổ.
Sử dụng trực tiếp quy tắc từ database/chan_nguyen.py và database/economy_config.json.
"""

import os
import sys
from typing import Dict, Any, Tuple, List

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from database.chan_nguyen import (
    MAU_CHAN_NGUYEN,
    tinh_tieu_hao_thuc_te,
    tinh_so_lan_su_dung,
)


def classify_aptitude(aptitude_percent: int) -> str:
    if aptitude_percent >= 80:
        return "Giáp"
    if aptitude_percent >= 60:
        return "Ất"
    if aptitude_percent >= 40:
        return "Bính"
    return "Đinh"


def get_essence_color(rank: int, sub_realm: str) -> str:
    rank_map = MAU_CHAN_NGUYEN.get(rank, MAU_CHAN_NGUYEN[1])
    return rank_map.get(sub_realm, "Xanh biếc (Thúy lục)")


def get_essence_hex(rank: int, sub_realm: str) -> str:
    if rank == 1:
        return {
            "sơ giai": "#2dd4bf",
            "trung giai": "#10b981",
            "cao giai": "#059669",
            "đỉnh phong": "#047857",
        }.get(sub_realm, "#2dd4bf")
    if rank == 2:
        return {
            "sơ giai": "#f87171",
            "trung giai": "#ef4444",
            "cao giai": "#dc2626",
            "đỉnh phong": "#991b1b",
        }.get(sub_realm, "#f87171")
    return "#e2e8f0"


def get_realm_stage(rank: int, sub_realm: str, econ: Dict[str, Any]) -> Tuple[int, Dict[str, Any]]:
    stages = econ["cultivation"]["realm_progression"]
    for idx, st in enumerate(stages):
        if st["rank"] == rank and st["sub_realm"] == sub_realm:
            return idx, st
    return 0, stages[0]


def recover_essence_over_time(player: Dict[str, Any], minutes: int, econ: Dict[str, Any]) -> float:
    """
    Hồi phục chân nguyên tự nhiên theo từng 1% tư chất (tư chất càng cao hồi càng nhanh).
    """
    if minutes <= 0:
        return 0.0
    max_thanh = round(player["aptitude_percent"] / 10.0, 2)
    base_ratio = econ["cultivation"]["base_recovery_ratio_per_hour"]
    # Tốc độ hồi tỉ lệ thuận với tư chất (tư chất 80% hồi nhanh gấp đôi 40%)
    apt_factor = player["aptitude_percent"] / 50.0
    hours = minutes / 60.0
    gained = max_thanh * base_ratio * apt_factor * hours
    before = player["essence_thanh"]
    player["essence_thanh"] = round(min(max_thanh, before + gained), 2)
    return round(player["essence_thanh"] - before, 2)


def nurture_aperture(
    player: Dict[str, Any],
    minutes: int,
    use_stones: bool,
    econ: Dict[str, Any],
    zone_bonus: float = 1.0,
) -> Dict[str, Any]:
    """
    Ôn dưỡng vách Không Khiếu để nâng tiến độ tiểu cảnh giới.
    - Không dùng nguyên thạch: dùng chân nguyên tự hồi, chậm hơn.
    - Dùng nguyên thạch: hấp thu tinh hoa nguyên thạch hồi chân nguyên liên tục, tốc độ x2.4!
    - Có Tửu Trùng (GU_R1_22): tinh luyện chân nguyên tăng thêm 35% hiệu suất ôn dưỡng!
    """
    hours = max(0.25, minutes / 60.0)
    max_thanh = round(player["aptitude_percent"] / 10.0, 2)
    apt_grade = player["aptitude_grade"]
    apt_bonus = econ["cultivation"]["aptitude_breakthrough_bonus"].get(apt_grade, 1.0)

    has_liquor_worm = any(g["id"] == "GU_R1_22" and g.get("alive", True) for g in player.get("gu_list", []))
    liquor_mult = 1.35 if has_liquor_worm else 1.0

    stones_spent = 0
    if use_stones and player["stones"] >= 1:
        stones_needed = max(1, int(round(hours * 0.5)))
        stones_spent = min(player["stones"], stones_needed)
        player["stones"] -= stones_spent
        # Hấp thu nguyên thạch giúp đầy chân nguyên
        stone_boost = stones_spent * econ["cultivation"]["stone_recovery_boost_thanh"]
        player["essence_thanh"] = round(min(max_thanh, player["essence_thanh"] + stone_boost), 2)

    # Dùng chân nguyên khả dụng để cọ rửa vách không khiếu
    usable_thanh = max(0.5, min(player["essence_thanh"], max_thanh * 0.65 * hours))
    player["essence_thanh"] = round(max(0.0, player["essence_thanh"] - usable_thanh * 0.5), 2)
    # Hồi một phần trong lúc minh tưởng
    recover_essence_over_time(player, int(minutes * 0.6), econ)

    base_gain = usable_thanh * econ["cultivation"]["wall_progress_per_thanh_raw"]
    if stones_spent > 0:
        base_gain *= econ["cultivation"]["wall_progress_stone_multiplier"]

    wall_gain = round(base_gain * apt_bonus * liquor_mult * zone_bonus, 2)
    player["wall_progress"] = round(player["wall_progress"] + wall_gain, 2)

    # Kiểm tra đột phá cảnh giới
    stages = econ["cultivation"]["realm_progression"]
    idx, current_stage = get_realm_stage(player["rank"], player["sub_realm"], econ)
    broke_through = False
    new_realm_label = None

    if idx < len(stages) - 1 and player["wall_progress"] >= current_stage["wall_required"]:
        # Đột phá lên cảnh giới kế tiếp!
        overflow = round(player["wall_progress"] - current_stage["wall_required"], 2)
        next_stage = stages[idx + 1]
        # Bức tường tư chất: Đinh đẳng rất khó lên Nhị chuyển trong năm 1
        if next_stage["rank"] == 2 and player["aptitude_percent"] < 40:
            player["wall_progress"] = float(current_stage["wall_required"])
        else:
            player["rank"] = next_stage["rank"]
            player["sub_realm"] = next_stage["sub_realm"]
            player["wall_progress"] = max(0.0, round(overflow * 0.3, 2))
            player["essence_thanh"] = max_thanh
            broke_through = True
            new_realm_label = f"{'Nhất' if player['rank']==1 else 'Nhị'} chuyển {player['sub_realm']}"

    return {
        "minutes": minutes,
        "stones_spent": stones_spent,
        "wall_gain": wall_gain,
        "has_liquor_worm": has_liquor_worm,
        "broke_through": broke_through,
        "new_realm_label": new_realm_label,
        "essence_thanh": player["essence_thanh"],
        "max_thanh": max_thanh,
    }


def tick_gu_hunger(player: Dict[str, Any], days_passed: int) -> List[str]:
    """
    Cập nhật chu kỳ đói của từng con Cổ mỗi khi qua ngày mới.
    Bỏ đói quá hạn -> yếu đi -> chết đói (mất vĩnh viễn!).
    """
    if days_passed <= 0:
        return []
    alerts: List[str] = []
    surviving_gu = []
    for gu in player.get("gu_list", []):
        if gu.get("feed_interval_days", 8) >= 900:
            surviving_gu.append(gu)
            continue
        gu["days_until_hungry"] = gu.get("days_until_hungry", 7) - days_passed
        if gu["days_until_hungry"] <= -3:
            alerts.append(f"💀 {gu['name']} đã chết đói trong Không Khiếu vì bị bỏ đói quá lâu!")
            continue  # Chết vĩnh viễn
        elif gu["days_until_hungry"] <= 0:
            gu["starving"] = True
            alerts.append(
                f"🩸 CẢNH BÁO KHẨN: {gu['name']} đang chết đói! Cần cho ăn [{gu['food_name']}] ngay kẻo chết!"
            )
        elif gu["days_until_hungry"] <= 2:
            gu["starving"] = False
            alerts.append(
                f"⚠️ {gu['name']} sắp đói (còn {gu['days_until_hungry']} ngày — cần {gu['food_name']})."
            )
        else:
            gu["starving"] = False
        surviving_gu.append(gu)
    player["gu_list"] = surviving_gu
    return alerts


def compute_combat_power(player: Dict[str, Any], econ: Dict[str, Any]) -> Dict[str, Any]:
    """
    Tính sức chiến đấu tổng hợp cho Lôi Đài Niên Mạt Khảo Hạch & d100 context.
    Dựa trên: Cảnh giới + Số phát Nguyệt Nhận bắn được (chan_nguyen.py) + Cổ trùng + Khí lực (Trư lực) + Kinh nghiệm thực chiến.
    """
    _, stage = get_realm_stage(player["rank"], player["sub_realm"], econ)
    base_realm = stage["combat_power"]
    max_thanh = player["aptitude_percent"] / 10.0

    # Số phát Nguyệt Quang Cổ bắn được theo chan_nguyen.py
    has_moonlight = any(g["id"] == "GU_R1_01" for g in player.get("gu_list", []))
    moonlight_shots = tinh_so_lan_su_dung(1.0, max_thanh, player["sub_realm"]) if has_moonlight else 0

    gu_bonus = 0
    for g in player.get("gu_list", []):
        if g.get("starving"):
            gu_bonus += 2
        elif g["id"] in ("GU_R1_12", "GU_R1_06", "GU_R1_07", "GU_R1_22"):
            gu_bonus += 18
        elif g["id"] in ("GU_R1_01", "GU_R1_02", "GU_R1_14", "GU_R1_04"):
            gu_bonus += 10
        else:
            gu_bonus += 6

    strength_bonus = int(player.get("boar_strength", 0.0) * 28)
    skill_bonus = int(player.get("combat_skill", 0) * 0.6)
    hp_factor = max(0.3, player.get("hp", 100) / 100.0)

    total = int((base_realm + gu_bonus + strength_bonus + skill_bonus + min(20, moonlight_shots * 1.5)) * hp_factor)
    return {
        "total": total,
        "base_realm": base_realm,
        "gu_bonus": gu_bonus,
        "strength_bonus": strength_bonus,
        "skill_bonus": skill_bonus,
        "moonlight_shots_max": moonlight_shots,
        "essence_cost_moonlight": tinh_tieu_hao_thuc_te(1.0, player["sub_realm"]),
        "essence_color": get_essence_color(player["rank"], player["sub_realm"]),
        "essence_hex": get_essence_hex(player["rank"], player["sub_realm"]),
    }
