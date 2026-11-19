# -*- coding: utf-8 -*-
"""
Quản Trò Cục Bộ (Built-in Deterministic GM) cho chế độ chơi thử ngay không cần API Key
hoặc làm fallback an toàn khi chưa cấu hình Google AI Studio API Key.
Vẫn chạy đúng 100% cơ chế Hybrid: Target 1-100 -> Code tung d100 -> Miêu tả theo bậc Delta -> Đánh giá ảnh hưởng NPC (Câu 6).
"""

import random
from typing import Any, Dict, List, Optional

from engine.world_engine import roll_d100
from engine.time_system import format_clock, get_schedule_reminder
from engine.cultivation import compute_combat_power


def _pick_target(prompt: str, state: Dict[str, Any], combat_total: int) -> Dict[str, Any]:
    low = prompt.lower()
    p = state["player"]
    ev_id = state.get("active_scene", {}).get("event_id")

    # Hành động nhẹ/rút lui/quan sát thường dễ và tốn ít thời gian
    if any(k in low for k in ["rời đi", "cáo từ", "bỏ đi", "rút lui", "quay về", "về phòng", "né", "tránh"]):
        return {
            "requires_roll": False,
            "target": 20,
            "minutes_spent": 15,
            "reasoning": "Hành động rút lui/cáo từ thận trọng, không cần thử thách mạo hiểm.",
            "intent": "retreat",
        }

    if any(k in low for k in ["nộp", "đóng tiền", "chịu thua", "nhượng bộ"]) and ev_id == "tran_lot_hoc_duong":
        return {
            "requires_roll": False,
            "target": 15,
            "minutes_spent": 15,
            "reasoning": "Chấp nhận quy tắc thực tế để tránh thương vong không cần thiết.",
            "intent": "pay_extortion",
        }

    # Chiến đấu / đối đầu trực diện / mạo hiểm
    base_target = 52
    minutes = 30
    intent = "interact"

    if any(k in low for k in ["đánh", "tấn công", "phóng", "chống cự", "khiêu chiến", "giết", "lôi đài", "dốc toàn lực"]):
        intent = "combat"
        base_target = 68 - min(25, combat_total // 3)
        minutes = 40
        if ev_id == "tran_lot_hoc_duong":
            base_target = max(62, 82 - combat_total // 3)  # Phương Nguyên rất mạnh cận chiến!
        elif ev_id == "dai_hoi_loi_dai":
            base_target = max(38, 80 - int(combat_total * 0.55))
            minutes = 90
    elif any(k in low for k in ["tranh hạng nhất", "thức trắng", "đột phá", "luyện hóa"]):
        intent = "refine_race"
        base_target = 75 - int(p["aptitude_percent"] * 0.35)
        minutes = 120
    elif any(k in low for k in ["bắn", "bia", "thảo nhân"]):
        intent = "archery"
        base_target = max(35, 68 - p["combat_skill"] // 2 - (10 if p["rank"] >= 1 and p["sub_realm"] != "sơ giai" else 0))
        minutes = 60
    elif any(k in low for k in ["thuyết phục", "thương lượng", "trao đổi", "đề nghị", "làm quen", "chào hỏi", "hỏi thăm", "dò"]):
        intent = "diplomacy"
        base_target = 48 - int(p["reputation"] * 0.1)
        minutes = 25
    elif any(k in low for k in ["đổ thạch", "mua đá", "đá thô"]):
        intent = "gamble"
        base_target = 68 - int(p["luck"] * 0.25)
        minutes = 30
    elif any(k in low for k in ["lẻn", "rình", "theo dõi", "tìm", "thăm dò", "động hoa tửu", "thác"]):
        intent = "stealth"
        base_target = 58
        minutes = 45

    # Điều chỉnh nhẹ theo khí vận
    luck_adj = int(p.get("luck", 0) * 0.12)
    final_target = max(18, min(95, base_target - luck_adj))
    return {
        "requires_roll": True,
        "target": final_target,
        "minutes_spent": minutes,
        "reasoning": f"Thẩm định dựa trên chiến lực ({combat_total}), tư chất ({p['aptitude_percent']}%), khí vận ({p['luck']}) và bối cảnh hiện tại.",
        "intent": intent,
    }


def resolve_offline_turn(
    engine: Any, bundle: Dict[str, Any], user_prompt: str
) -> Dict[str, Any]:
    st = bundle["state"]
    p = st["player"]
    scene = st["active_scene"]
    ev_id = scene.get("event_id")
    combat = compute_combat_power(p, engine.econ_tpl)

    plan = _pick_target(user_prompt, st, combat["total"])
    dice = roll_d100(plan["target"]) if plan["requires_roll"] else None

    # Cộng thời gian thật trước khi viết lời nhắc lịch
    tick = engine.advance_time(bundle, plan["minutes_spent"], silent=True)
    clk = format_clock(st["day"], st["minute_of_day"])
    reminder = get_schedule_reminder(st["minute_of_day"], st["location"], st["schedule"])

    npcs_by_id = {n["id"]: n for n in bundle["npcs"]}
    present_npcs = [npcs_by_id[nid] for nid in scene.get("present_npcs", []) if nid in npcs_by_id]
    lead_npc = present_npcs[0] if present_npcs else None

    effects: Dict[str, Any] = {}
    scene_ended = False
    impacts: Dict[str, Any] = {"impacted_npcs": [], "propagations": [], "new_rumor": ""}
    narrative = ""
    suggested = [
        "Kết thúc cảnh này và quay về bám sát lịch trình trong ngày",
        "Tiếp tục dò hỏi thêm thông tin trước khi rời đi",
    ]

    delta = dice["delta"] if dice else 20
    intent = plan["intent"]

    # Xử lý theo từng mốc sự kiện lớn Năm 1 hoặc tương tác tự do
    if intent == "retreat":
        scene_ended = True
        narrative = (
            f"Ngươi giữ nét mặt điềm tĩnh, không sa đà tranh chấp vô ích rồi dứt khoát rút khỏi tầm mắt đám đông "
            f"(tốn {plan['minutes_spent']} phút). Ở Cổ Nguyệt Sơn Trại, kẻ biết giấu mình mới là kẻ sống sót lâu nhất."
        )
        suggested = ["Chạy tiếp lịch trình trong ngày", "Mở bản đồ di chuyển sang vùng khác"]

    elif ev_id == "khai_khieu":
        scene_ended = True
        if delta >= 0:
            effects["reputation_delta"] = 4
            narrative = (
                f"Cử chỉ chừng mực của ngươi giữa đại sảnh Từ Đường thu hút ánh nhìn thoáng qua của **Học Đường Gia Lão**. "
                f"Trong khi đám thiếu niên khác còn đang xôn xao bàn tán về Giáp đẳng Phương Chính, ngươi đã sớm ghi nhớ từng gương mặt phe Xích – Mạc và ánh mắt lạnh băng của Phương Nguyên.\n\n"
                f"Đại điển khép lại. Hai ngày nữa sẽ chính thức nhập Học Đường nhận Bản Mệnh Cổ."
            )
            impacts["impacted_npcs"].append({
                "npc_id": "hoc_duong_gia_lao",
                "affinity_delta": 5,
                "new_impression": "Tân đệ tử trầm tĩnh, biết chừng mực",
                "new_memory": f"{p['name']} tỏ ra điềm đạm khác thường ngay trong Đại Điển Khai Khiếu.",
            })
        else:
            effects["reputation_delta"] = -2
            narrative = (
                f"Giữa chốn đông người của Từ Đường, động thái của ngươi có phần gượng gạo, khiến Cổ Nguyệt Mạc Bắc đứng gần đó khẽ hừ lạnh chế giễu. "
                f"May mắn Tộc trưởng Cổ Nguyệt Bác sớm tuyên bố tan lễ, kết thúc ngày Khai Khiếu đầu tiên."
            )
        suggested = ["Chạy tiếp lịch trình sang Ngày 3 nhập Học Đường", "Về Ký Túc Xá ôn dưỡng Không Khiếu sớm"]

    elif ev_id == "chon_ban_menh_co":
        scene_ended = True
        if intent == "refine_race" and delta >= 15:
            effects["stones_delta"] = 15
            effects["reputation_delta"] = 10
            effects["essence_delta"] = -2.0
            narrative = (
                f"**Kỳ tích tại Học Đường!** Ngươi cắn răng chịu đựng cảm giác Không Khiếu căng tức, liên tục mài giũa chân nguyên suốt canh giờ không nghỉ. "
                f"Trước sự kinh ngạc của cả 57 học viên — và một tia sáng sắc lạnh lóe lên trong mắt Phương Nguyên — ngươi luyện hóa xong Bản Mệnh Cổ ngay trong tốp đầu!\n\n"
                f"Học Đường Gia Lão gật đầu khen ngợi, ban thưởng **+15 nguyên thạch** ngay trước lớp!"
            )
            impacts["impacted_npcs"].append({
                "npc_id": "phuong_nguyen",
                "affinity_delta": -8,
                "new_impression": "Biến số đáng chú ý cùng khóa",
                "new_memory": f"{p['name']} đoạt thành tích vượt dự liệu trong kỳ luyện Bản Mệnh Cổ.",
            })
            impacts["new_rumor"] = f"Thiếu niên {p['name']} ({p['aptitude_grade']} đẳng) gây bất ngờ lớn khi luyện hóa Bản Mệnh Cổ nhanh kỷ lục ngay tuần đầu Học Đường!"
        elif delta >= 0:
            effects["stones_delta"] = 3
            effects["essence_delta"] = -1.2
            narrative = (
                f"Ngươi luyện hóa thành công Bản Mệnh Cổ một cách vững chắc, không gặp phản phệ. "
                f"Ngôi đầu bảng vẫn rơi vào tay Cổ Nguyệt Phương Nguyên đầy bất ngờ, nhưng ngươi vẫn nhận được **+3 nguyên thạch** khích lệ từ Học Đường Gia Lão."
            )
        else:
            effects["hp_delta"] = -10
            effects["essence_delta"] = -2.0
            narrative = (
                f"Vì quá nôn nóng thúc giục chân nguyên khi vách Không Khiếu còn non, Bản Mệnh Cổ giãy giụa phản phệ khiến ngươi nôn khan một ngụm máu nhẹ (-10 Sinh lực). "
                f"Mất thêm một canh giờ điều tức, ngươi mới miễn cưỡng hoàn tất luyện hóa."
            )
        suggested = ["Chạy tiếp lịch trình tích lũy tu vi", "Đi Khu Phố kiểm tra giá Cánh Hoa Nguyệt Lan Thảo"]

    elif ev_id == "tran_lot_hoc_duong":
        scene_ended = True
        if intent == "pay_extortion":
            effects["paying_pn_extortion"] = True
            effects["stones_delta"] = -1
            narrative = (
                f"Trước cổng Học Đường, nhìn Phương Chính bị đấm hộc máu còn Mạc Bắc, Xích Thành cũng chịu trận, ngươi bình tĩnh lấy ra **1 khối nguyên thạch** đặt vào tay Phương Nguyên.\n\n"
                f"Phương Nguyên liếc ngươi một cái rồi thu đá vào túi, không nói lời thừa. Từ tuần này, mỗi lần lĩnh trợ cấp Học Đường sẽ phải trích 1 nguyên thạch nộp cho hắn — nhưng đổi lại ngươi giữ nguyên gân cốt lành lặn để tu luyện."
            )
            impacts["impacted_npcs"].append({
                "npc_id": "phuong_nguyen",
                "affinity_delta": 3,
                "new_impression": "Kẻ thức thời, không cần tốn sức dạy dỗ",
                "new_memory": f"{p['name']} biết điều, chủ động nộp 1 nguyên thạch/tuần mà không làm ầm ĩ.",
            })
        elif intent == "combat":
            effects["defied_pn"] = True
            if delta >= 15:
                effects["reputation_delta"] = 12
                effects["combat_skill_delta"] = 5
                effects["hp_delta"] = -12
                narrative = (
                    f"Ngươi không lùi nửa bước, tung đòn đánh trả sòng phẳng với Phương Nguyên ngay trước cổng Học Đường! "
                    f"Hai bên ăn miếng trả miếng dữ dội; dù ngươi trúng đòn bầm dập (-12 Sinh lực), Phương Nguyên nhận ra ép ngươi tốn quá nhiều công sức không xứng với 1 khối nguyên thạch nên lạnh mặt thu tay bỏ đi.\n\n"
                    f"**Ngươi đã giữ được trọn vẹn 3 nguyên thạch trợ cấp hàng tuần!**"
                )
                impacts["impacted_npcs"].append({
                    "npc_id": "phuong_nguyen",
                    "affinity_delta": -15,
                    "new_impression": "Cái gai khó gặm, cần dè chừng",
                    "new_goal": "Tìm cơ hội thích hợp để triệt tiêu hoặc lợi dụng mối đe dọa từ người chơi.",
                    "new_memory": f"{p['name']} dám đánh trả sòng phẳng tại cổng Học Đường, phá thế trấn lột.",
                })
                impacts["new_rumor"] = f"Chấn động Học Đường: {p['name']} là người duy nhất dám chống cự Phương Nguyên tại cổng trường mà không chịu nộp nguyên thạch!"
            else:
                effects["hp_delta"] = -28
                effects["stones_delta"] = -1
                effects["paying_pn_extortion"] = True
                narrative = (
                    f"Kinh nghiệm thực chiến tàn nhẫn của Phương Nguyên vượt xa tưởng tượng của thiếu niên 15 tuổi! "
                    f"Chưa kịp tụ đủ chân nguyên, ngươi đã bị hắn áp sát tung hai cú đá chuẩn xác vào mạng sườn ngã gục (-28 Sinh lực). Hắn lạnh lùng lục túi lấy đi 1 nguyên thạch giữa ánh mắt khiếp đảm của cả lớp."
                )
                impacts["impacted_npcs"].append({
                    "npc_id": "phuong_nguyen",
                    "affinity_delta": -10,
                    "new_impression": "Kẻ cứng đầu nhưng thực lực chưa đủ",
                    "new_memory": f"Từng đánh gục {p['name']} trước cổng Học Đường để lập uy.",
                })
        else:
            if delta >= 0:
                effects["reputation_delta"] = -3
                narrative = (
                    f"Ngươi khôn khéo rời lớp từ lối cửa sau gần Dược Đường, né trọn chốt chặn của Phương Nguyên mà không mất một xu nguyên thạch nào! "
                    f"Tuy vậy, ánh mắt sắc lạnh của hắn từ xa vẫn khiến sống lưng ngươi lành lạnh."
                )
            else:
                effects["stones_delta"] = -1
                effects["paying_pn_extortion"] = True
                narrative = (
                    f"Phương Nguyên như đã đoán trước đường lách của ngươi, chặn ngay góc rẽ hành lang. Không còn đường lui, ngươi đành giao ra 1 nguyên thạch để yên thân."
                )

    elif ev_id == "khao_hach_ban_bia":
        scene_ended = True
        if delta >= 15:
            effects["stones_delta"] = 20
            effects["reputation_delta"] = 10
            effects["combat_skill_delta"] = 4
            narrative = (
                f"Lưỡi Nguyệt Nhận xanh lam xé gió găm thẳng vào yết hầu và tim bia thảo nhân! "
                f"Học Đường Gia Lão gật đầu tán thưởng, thưởng nóng **+20 nguyên thạch**. Trên khán đài, ánh mắt của Mạc Trần và Xích Luyện đều dừng lại trên người ngươi thêm vài nhịp thở."
            )
            impacts["impacted_npcs"].append({
                "npc_id": "hoc_duong_gia_lao",
                "affinity_delta": 10,
                "new_impression": "Học viên xuất sắc, thực chiến vững vàng",
                "new_memory": f"{p['name']} bắn trúng yếu hại bia thảo nhân ở kỳ khảo hạch giữa năm.",
            })
        elif delta >= 0:
            effects["stones_delta"] = 8
            effects["combat_skill_delta"] = 2
            narrative = (
                f"Ngươi kiểm soát ổn định quỹ đạo Nguyệt Nhận, chém rách vai và ngực thảo nhân — đạt hạng khá và lĩnh thưởng **+8 nguyên thạch**."
            )
        else:
            effects["essence_delta"] = -1.5
            narrative = (
                f"Gió núi đột ngột đổi chiều khiến lưỡi Nguyệt Nhận trượt mép rơm. Ngươi chỉ đạt mức trung bình yếu, không có thưởng thêm — nhưng đây là lời cảnh tỉnh rõ rệt trước Đại Hội cuối năm."
            )

    elif ev_id == "ma_dao_vuong_dai":
        scene_ended = True
        if delta >= 15:
            effects["stones_delta"] = 35
            effects["reputation_delta"] = 18
            effects["combat_skill_delta"] = 6
            effects["hp_delta"] = -15
            narrative = (
                f"Trong màn tuyết dày, ngươi phát giác sát khí độc địa của Ma Đạo **Vương Đại** sớm hơn nửa nhịp thở! "
                f"Tránh được đòn ám toán cổ độc Ái Sinh Ly trong gang tấc, ngươi tung đòn phản công dứt khoát phối hợp cùng tuần tra Hình Đường đánh trọng thương hắn (-15 Sinh lực).\n\n"
                f"Hình Đường Gia Lão đích thân ghi công, ban thưởng **+35 nguyên thạch**!"
            )
            impacts["impacted_npcs"].append({
                "npc_id": "hinh_duong_gia_lao",
                "affinity_delta": 18,
                "new_impression": "Tân binh cảnh giác, có công phát giác ma đầu",
                "new_memory": f"{p['name']} góp công đẩy lùi ma đạo Vương Đại giữa mùa đông.",
            })
            impacts["new_rumor"] = f"Mùa đông dậy sóng: Học viên {p['name']} sống sót trước ma đầu Vương Đại và được Hình Đường ban thưởng!"
        elif delta >= 0:
            effects["hp_delta"] = -25
            narrative = (
                f"Vương Đại ra tay hiểm độc giữa rừng tuyết, lưỡi độc sượt qua vai khiến ngươi mất máu (-25 Sinh lực) nhưng ngươi kịp phóng tín hiệu và rút về trong tường rào Thiết Đằng Cổ an toàn."
            )
        elif delta >= -49:
            effects["hp_delta"] = -55
            narrative = (
                f"Cổ độc Ái Sinh Ly nổ tung sát người khiến ngươi trọng thương nặng (-55 Sinh lực), suýt nữa mất mạng giữa rừng trúc trước khi đội tuần tra tới ứng cứu!"
            )
        else:
            effects["fatal_death"] = True
            effects["death_reason"] = "Bị Ma Đạo Cổ Sư Vương Đại ám sát bằng cổ độc Ái Sinh Ly trong đêm tuyết rơi Mùa Đông."
            narrative = (
                f"Ánh sáng tím đen của cổ độc Ái Sinh Ly bùng nổ ở cự ly gần. Không kịp kích hoạt phòng ngự, lục phủ ngũ tạng của ngươi đóng băng trong tuyệt vọng giữa rừng tuyết Thanh Mao Sơn...\n\n"
                f"**Thiên đạo vô tình. Sinh mệnh của {p['name']} đã khép lại ở tuổi 15.**"
            )

    elif ev_id == "dai_hoi_loi_dai":
        scene_ended = True
        total_score_eval = combat["total"] + delta
        effects["complete_year1"] = True
        if total_score_eval >= 95:
            effects["stones_delta"] = 150
            effects["exam_final_rank"] = "Hạng 1 — Quán Quân Niên Mạt Khảo Hạch!"
            effects["assigned_squad"] = "Quyền tự chọn Tiểu tổ (Thanh Thư / Xích Sơn / Mạc Nhan / Giác Tam)"
            narrative = (
                f"### 🏆 CHẤN ĐỘNG TOÀN TRẠI — QUÁN QUÂN NIÊN MẠT KHẢO HẠCH!\n"
                f"Trên lôi đài đá phủ tuyết trắng, ngươi vận dụng trọn vẹn thực lực tích lũy suốt 360 ngày (Chiến lực: {combat['total']}), "
                f"hạ gục lần lượt các đối thủ sừng sỏ trước ánh mắt trợn trừng của Tộc trưởng Cổ Nguyệt Bác và toàn bộ Hội đồng Gia lão!\n\n"
                f"Học Đường Gia Lão vang giọng tuyên bố **HẠNG NHẤT**, trao thưởng **+150 nguyên thạch** và quyền ưu tiên chọn Cổ trùng cùng Tiểu tổ dã ngoại! "
                f"Ngươi đã viết lại lịch sử Năm Thứ Nhất tại Cổ Nguyệt Sơn Trại!"
            )
        elif total_score_eval >= 65:
            effects["stones_delta"] = 60
            effects["exam_final_rank"] = "Top 5 — Tinh Anh Khóa Mới"
            effects["assigned_squad"] = "Tiểu tổ Tinh Anh (được Mạc Mạch / Xích Mạch mời chào)"
            narrative = (
                f"### ⚔️ TỐT NGHIỆP XUẤT SẮC — TOP 5 NIÊN MẠT KHẢO HẠCH!\n"
                f"Ngươi chiến đấu kiên cường trên lôi đài tuyết, chỉ chịu dừng bước trước những quái vật đầu bảng như Phương Nguyên hay Phương Chính. "
                f"Gia tộc ban thưởng **+60 nguyên thạch** và nhiều tiểu tổ chủ lực lập tức gửi lời mời ngươi gia nhập bước sang Năm Thứ Hai!"
            )
        elif total_score_eval >= 35:
            effects["stones_delta"] = 20
            effects["exam_final_rank"] = "Hạng Trung Bình Khá (Top 20/57)"
            effects["assigned_squad"] = "Tiểu tổ Dã Ngoại Thường (Giác Tam / Giang Hạc)"
            narrative = (
                f"### 📜 HOÀN THÀNH KHẢO HẠCH — ĐỨNG VỮNG TẠI SƠN TRẠI\n"
                f"Dù xuất thân không thuận lợi, ngươi vẫn vượt qua 1 năm khắc nghiệt với đủ thực lực tốt nghiệp Học Đường (+20 nguyên thạch) và chính thức bước vào hàng ngũ Cổ sư dã ngoại."
            )
        else:
            effects["stones_delta"] = 5
            effects["exam_final_rank"] = "Nhóm Hậu Cần (Top cuối 57 đệ tử)"
            effects["assigned_squad"] = "Đội Hậu Cần & Trấn Thủ Nội Trại"
            narrative = (
                f"### ❄️ KẾT THÚC NĂM THỨ NHẤT — KẺ SỐNG SÓT THẦM LẶNG\n"
                f"Trên lôi đài, chênh lệch tu vi và Cổ trùng khiến ngươi sớm thất thế. Tuy bị phân về tuyến hậu cần với 5 nguyên thạch trợ cấp, ngươi vẫn giữ trọn mạng sống qua năm đầu tiên tại Thanh Mao Sơn."
            )

    else:
        # Tương tác tự do chung (gặp NPC tại các vùng bản đồ, Động Hoa Tửu, sạp hàng...)
        npc_name = lead_npc["name"] if lead_npc else "khu vực quanh đây"
        if st["location"] == "dong_hoa_tuu" and delta >= 15 and not any(g["id"] == "GU_R1_22" for g in p["gu_list"]):
            effects["grant_gu_id"] = "GU_R1_22"
            effects["luck_delta"] = 8
            scene_ended = True
            narrative = (
                f"Men theo kẽ nứt ẩm lạnh sau rèm thác nước nhỏ, ngươi phát hiện vũng rượu ngầm tỏa hương nồng nàn. "
                f"Nhờ xử lý khéo léo, ngươi dụ bắt thành công một con **Tửu Trùng (Nhất Chuyển Cực Phẩm)** mập mạp trắng muốt!\n\n"
                f"*(Tửu Trùng sẽ tăng 35% hiệu suất ôn dưỡng vách Không Khiếu mỗi khi ngươi tu luyện!)*"
            )
            impacts["impacted_npcs"].append({
                "npc_id": "phuong_nguyen",
                "affinity_delta": -15,
                "new_impression": "Kẻ đã cướp cơ duyên Động Hoa Tửu",
                "new_goal": "Truy tìm kẻ đã lấy mất Tửu Trùng trước mình.",
                "new_memory": "Động Hoa Tửu Tầng 1 đã có dấu chân người khác đi trước lấy mất Tửu Trùng.",
            })
        elif delta >= 15:
            aff_gain = 10 if intent == "diplomacy" else 6
            effects["stones_delta"] = 2 if intent in ("diplomacy", "stealth") else 0
            effects["combat_skill_delta"] = 2 if intent == "combat" else 0
            narrative = (
                f"Nước đi của ngươi trước **{npc_name}** tỏ ra cực kỳ sắc sảo và đúng thời điểm. "
                f"Đối phương không giấu được tia bất ngờ, thái độ dịu xuống rõ rệt và để lộ cho ngươi một vài lợi thế thiết thực "
                f"{'(thu thêm +2 nguyên thạch / tin có giá trị)' if effects['stones_delta'] else '(nâng cao rõ rệt uy thế cá nhân)'}."
            )
            if lead_npc:
                impacts["impacted_npcs"].append({
                    "npc_id": lead_npc["id"],
                    "affinity_delta": aff_gain,
                    "new_impression": "Kẻ có bản lĩnh và biết tính toán",
                    "new_memory": f"Có cuộc chạm trán ấn tượng với {p['name']} tại {st['location']}.",
                })
                # Cơ chế A có điều kiện theo tính cách NPC
                if "cao" in lead_npc.get("public_leak_tendency", "") and lead_npc.get("close_contacts"):
                    impacts["propagations"].append({
                        "contact_id": lead_npc["close_contacts"][0],
                        "affinity_delta": 3 if aff_gain > 0 else -5,
                        "heard_version": f"Nghe {lead_npc['name']} nhắc tới {p['name']} với thái độ khá chú ý.",
                    })
        elif delta >= 0:
            narrative = (
                f"Ngươi xử lý tình huống với **{npc_name}** một cách vừa vặn, không lời quá nhiều nhưng cũng giữ trọn thể diện và mục đích ban đầu."
            )
            if lead_npc:
                impacts["impacted_npcs"].append({
                    "npc_id": lead_npc["id"],
                    "affinity_delta": 3,
                    "new_memory": f"Từng trao đổi ngắn với {p['name']}.",
                })
        elif delta >= -49:
            effects["hp_delta"] = -12 if intent == "combat" else 0
            effects["reputation_delta"] = -3
            narrative = (
                f"Tính toán của ngươi gặp sơ hở khiến **{npc_name}** nắm được thế chủ động. "
                f"Ánh mắt đối phương lạnh hẳn đi{' và ngươi phải chịu chút thương tích (-12 Sinh lực)' if effects['hp_delta'] else ', buông lời cảnh cáo đầy ẩn ý'}."
            )
            if lead_npc:
                impacts["impacted_npcs"].append({
                    "npc_id": lead_npc["id"],
                    "affinity_delta": -10,
                    "new_impression": "Kẻ thiếu khôn ngoan, đáng ghét",
                    "new_memory": f"Xảy ra va chạm khó chịu với {p['name']}.",
                })
                # Xét tính cách & bối cảnh công khai để quyết định lan truyền A / tin đồn C
                if "cao" in lead_npc.get("public_leak_tendency", "") and lead_npc.get("close_contacts"):
                    impacts["propagations"].append({
                        "contact_id": lead_npc["close_contacts"][0],
                        "affinity_delta": -8,
                        "heard_version": f"{lead_npc['name']} về kể lại chuyện bị {p['name']} gây hấn/làm mất mặt.",
                    })
                if "công khai" in scene.get("publicity", "") and "cao" in lead_npc.get("public_leak_tendency", ""):
                    impacts["new_rumor"] = f"Trong trại rộ tin {p['name']} vừa có xích mích công khai với {lead_npc['name']}!"
        else:
            effects["hp_delta"] = -28 if intent == "combat" else -10
            effects["stones_delta"] = -2
            narrative = (
                f"**Thảm bại!** Mưu tính phản tác dụng nặng nề trước **{npc_name}**. "
                f"Ngươi chịu tổn thất nặng ({effects['hp_delta']} Sinh lực, -2 nguyên thạch) và buộc phải rút lui trong chật vật."
            )
            scene_ended = True
            if lead_npc:
                impacts["impacted_npcs"].append({
                    "npc_id": lead_npc["id"],
                    "affinity_delta": -18,
                    "new_impression": "Kẻ thù / cái gai cần dẹp",
                    "new_memory": f"Đè bẹp mưu đồ của {p['name']} tại {st['location']}.",
                })

    # Lời nhắc lịch trình nếu sắp trễ / đang trễ
    if reminder["severity"] in ("warn", "danger"):
        narrative += f"\n\n> {reminder['message']}"

    if tick["logs"]:
        narrative += "\n\n" + "\n".join(f"_{ln}_" for ln in tick["logs"])

    return {
        "mode": "offline",
        "plan": plan,
        "dice": dice,
        "narrative": narrative,
        "effects": effects,
        "scene_ended": scene_ended,
        "impacts": impacts,
        "suggested_actions": suggested,
        "triggered_event": tick["triggered_event"],
        "clock_short": clk["short_display"],
    }
