# -*- coding: utf-8 -*-
"""
Hệ thống thời gian Canh giờ / Khắc (15 phút) và Quản lý Lịch Trình cá nhân.
1 năm = 360 ngày (12 tháng × 30 ngày, 4 mùa × 90 ngày).
"""

from typing import Dict, List, Any, Optional

CANH_GIO = [
    ("Tý", 23, 1),
    ("Sửu", 1, 3),
    ("Dần", 3, 5),
    ("Mão", 5, 7),
    ("Thìn", 7, 9),
    ("Tỵ", 9, 11),
    ("Ngọ", 11, 13),
    ("Mùi", 13, 15),
    ("Thân", 15, 17),
    ("Dậu", 17, 19),
    ("Tuất", 19, 21),
    ("Hợi", 21, 23),
]

SEASONS = [
    ("Xuân", 1, 90),
    ("Hạ", 91, 180),
    ("Thu", 181, 270),
    ("Đông", 271, 360),
]


def get_canh_gio(minute_of_day: int) -> str:
    hour = (minute_of_day // 60) % 24
    if hour == 23 or hour == 0:
        return "Tý"
    for name, start_h, end_h in CANH_GIO[1:]:
        if start_h <= hour < end_h:
            return name
    return "Tý"


def get_khac_in_canh(minute_of_day: int) -> int:
    """Mỗi canh giờ có 8 khắc (mỗi khắc = 15 phút)."""
    total_m = minute_of_day % 1440
    # Shift by +60 so Tý starts at 0
    shifted = (total_m + 60) % 1440
    in_canh = shifted % 120
    return (in_canh // 15) + 1


def format_clock(day: int, minute_of_day: int) -> Dict[str, Any]:
    day = max(1, min(365, day))
    month = ((day - 1) // 30) + 1
    day_of_month = ((day - 1) % 30) + 1
    season = "Đông"
    for s_name, s_start, s_end in SEASONS:
        if s_start <= day <= s_end:
            season = s_name
            break
    hour = (minute_of_day // 60) % 24
    minute = minute_of_day % 60
    canh = get_canh_gio(minute_of_day)
    khac = get_khac_in_canh(minute_of_day)
    weekday = ((day - 1) % 7) + 1  # 1..6 học, 7 nghỉ

    return {
        "day": day,
        "month": month,
        "day_of_month": day_of_month,
        "weekday": weekday,
        "season": season,
        "hour": hour,
        "minute": minute,
        "time_str": f"{hour:02d}:{minute:02d}",
        "canh_gio": canh,
        "khac": khac,
        "display": f"Ngày {day_of_month:02d}/Tháng {month:02d} (Mùa {season}) • Giờ {canh} khắc {khac} ({hour:02d}:{minute:02d})",
        "short_display": f"N{day}/360 • Mùa {season} • Giờ {canh} ({hour:02d}:{minute:02d})",
        "is_class_day": weekday in (1, 2, 3, 4, 5, 6) and day >= 3,
    }


def build_daily_schedule(goal_text: str, day: int, season: str) -> List[Dict[str, Any]]:
    """
    Sinh lịch trình trong ngày dựa trên Lịch cơ bản (Học Đường) + Mục tiêu người chơi đặt ra.
    """
    goal_lower = (goal_text or "").lower()
    weekday = ((day - 1) % 7) + 1
    is_class_day = weekday in (1, 2, 3, 4, 5, 6) and day >= 3

    schedule: List[Dict[str, Any]] = []

    # 1. Sáng sớm (05:30 - 06:45): Thức dậy & điểm tâm / kiểm tra Cổ
    schedule.append({
        "id": "morning_prep",
        "start_minute": 330,
        "end_minute": 405,
        "title": "Thức dậy & Điều tức chân nguyên",
        "zone": "ky_tuc_xa",
        "activity": "cultivate_light",
        "mandatory": False,
        "done": False,
    })

    # 2. Buổi sáng (07:00 - 11:00): Lịch cơ bản Học Đường (hoặc Khai Khiếu ngày 1)
    if day == 1:
        schedule.append({
            "id": "khai_khieu_ceremony",
            "start_minute": 420,
            "end_minute": 660,
            "title": "Dự Đại Điển Khai Khiếu tại Từ Đường",
            "zone": "tu_duong",
            "activity": "ceremony",
            "mandatory": True,
            "done": False,
        })
    elif is_class_day:
        schedule.append({
            "id": "academy_class",
            "start_minute": 420,
            "end_minute": 660,
            "title": "Lên Học Đường nghe Gia Lão giảng đạo",
            "zone": "hoc_duong",
            "activity": "class",
            "mandatory": True,
            "done": False,
        })
    else:
        schedule.append({
            "id": "weekend_morning",
            "start_minute": 420,
            "end_minute": 660,
            "title": "Ngày nghỉ — Tự do tu luyện tại Ký Túc Xá",
            "zone": "ky_tuc_xa",
            "activity": "cultivate",
            "mandatory": False,
            "done": False,
        })

    # 3. Buổi chiều (13:00 - 17:00): Tùy biến mạnh theo Mục tiêu người chơi
    if any(k in goal_lower for k in ["tiền", "nguyên thạch", "kiếm", "làm việc", "giàu", "chợ", "đổ thạch"]):
        target_zone = "quang_truong" if season == "Hạ" and day >= 135 else "khu_pho"
        schedule.append({
            "id": "afternoon_goal",
            "start_minute": 780,
            "end_minute": 1020,
            "title": "Kiếm nguyên thạch & giao dịch tại Chợ/Khu Phố",
            "zone": target_zone,
            "activity": "work",
            "mandatory": False,
            "done": False,
        })
    elif any(k in goal_lower for k in ["săn", "heo", "lực", "rừng", "thực chiến", "bí mật", "hoa tửu", "tửu trùng"]):
        schedule.append({
            "id": "afternoon_goal",
            "start_minute": 780,
            "end_minute": 1020,
            "title": "Ra Rừng Trúc săn thú / thăm dò sườn núi",
            "zone": "rung_truc",
            "activity": "hunt",
            "mandatory": False,
            "done": False,
        })
    elif any(k in goal_lower for k in ["quan hệ", "npc", "giao tiếp", "tin", "phe", "mạc", "xích", "phương nguyên", "phương chính", "tửu quán"]):
        schedule.append({
            "id": "afternoon_goal",
            "start_minute": 780,
            "end_minute": 1020,
            "title": "Nghe ngóng tin tức & kết giao tại Đông Môn / Quảng Trường",
            "zone": "dong_mon",
            "activity": "socialize",
            "mandatory": False,
            "done": False,
        })
    elif any(k in goal_lower for k in ["dược", "thảo", "cổ", "nuôi"]):
        schedule.append({
            "id": "afternoon_goal",
            "start_minute": 780,
            "end_minute": 1020,
            "title": "Phụ việc & tìm dược liệu nuôi Cổ tại Dược Đường",
            "zone": "duoc_duong",
            "activity": "work",
            "mandatory": False,
            "done": False,
        })
    else:
        schedule.append({
            "id": "afternoon_goal",
            "start_minute": 780,
            "end_minute": 1020,
            "title": "Tập luyện Nguyệt Nhận & rèn thể chất tại Võ Trường",
            "zone": "hoc_duong",
            "activity": "train",
            "mandatory": False,
            "done": False,
        })

    # 4. Buổi tối (19:00 - 21:30): Ôn dưỡng Không Khiếu
    schedule.append({
        "id": "evening_cultivate",
        "start_minute": 1140,
        "end_minute": 1290,
        "title": "Ôn dưỡng vách Không Khiếu & kiểm tra Cổ trùng",
        "zone": "ky_tuc_xa",
        "activity": "cultivate",
        "mandatory": False,
        "done": False,
    })

    # 5. Đêm (22:00 - 05:30): Nghỉ ngơi hồi thể lực
    schedule.append({
        "id": "night_rest",
        "start_minute": 1320,
        "end_minute": 1440,
        "title": "Nghỉ ngơi dưỡng thần qua đêm",
        "zone": "ky_tuc_xa",
        "activity": "rest",
        "mandatory": False,
        "done": False,
    })

    return schedule


def get_schedule_reminder(minute_of_day: int, current_zone: str, schedule: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Kiểm tra xem người chơi sắp trễ giờ, đang trễ giờ hay đúng lịch trình.
    """
    upcoming: Optional[Dict[str, Any]] = None
    active: Optional[Dict[str, Any]] = None

    for block in schedule:
        if block.get("done"):
            continue
        if block["start_minute"] <= minute_of_day < block["end_minute"]:
            active = block
            break
        if block["start_minute"] > minute_of_day:
            upcoming = block
            break

    warning = None
    severity = "normal"

    if active:
        if active["zone"] != current_zone:
            late_min = minute_of_day - active["start_minute"]
            if active.get("mandatory"):
                severity = "danger"
                warning = (
                    f"⚠️ ĐANG TRỄ LỊCH BẮT BUỘC ({late_min} phút): '{active['title']}' tại [{active['zone']}]! "
                    f"Nếu tiếp tục vắng mặt sẽ bị Học Đường Gia Lão phạt nguyên thạch và trừ thiện cảm."
                )
            else:
                severity = "warn"
                warning = (
                    f"⏰ Đã vào khung giờ '{active['title']}' ({active['start_minute']//60:02d}:{active['start_minute']%60:02d}) "
                    f"nhưng ngươi vẫn đang ở ngoài vùng dự kiến."
                )
        else:
            remain = active["end_minute"] - minute_of_day
            warning = f"📋 Đang trong lịch: {active['title']} (còn {remain} phút)."
    elif upcoming:
        mins_left = upcoming["start_minute"] - minute_of_day
        if mins_left <= 30 and upcoming["zone"] != current_zone:
            severity = "warn" if not upcoming.get("mandatory") else "danger"
            warning = (
                f"⏳ Chỉ còn {mins_left} phút nữa là tới '{upcoming['title']}' tại [{upcoming['zone']}]! "
                f"Hãy tính thời gian di chuyển kẻo trễ giờ."
            )
        else:
            warning = (
                f"📅 Kế tiếp ({upcoming['start_minute']//60:02d}:{upcoming['start_minute']%60:02d}): "
                f"{upcoming['title']}."
            )

    return {
        "active": active,
        "upcoming": upcoming,
        "severity": severity,
        "message": warning or "🌙 Đã hoàn tất lịch trình trong ngày — có thể nghỉ ngơi sang ngày mới hoặc hành động tự do ban đêm.",
    }
