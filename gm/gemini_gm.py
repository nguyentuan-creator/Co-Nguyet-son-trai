# -*- coding: utf-8 -*-
"""
Quản Trò AI sử dụng Google AI Studio Gemini API (SDK google-genai).
- Hỗ trợ lấy API key & Model ID từ .env hoặc truyền trực tiếp từ Web UI Settings.
- Quy trình Hybrid 2 bước chuẩn xác:
  1) AI đánh giá tình huống -> Target (1-100) & minutes_spent
  2) Code thuần tung d100 thật & chạy đồng hồ thật (kiểm tra trễ lịch)
  3) AI miêu tả bám sát bậc Delta + xuất hiệu ứng trạng thái & Đánh giá ảnh hưởng cuối cảnh (Câu 6) bằng JSON Schema!
- Nếu chưa có API Key hoặc gặp lỗi mạng/quota -> tự động fallback êm sang offline_gm.
"""

import json
import os
from typing import Any, Dict, List, Optional

from engine.world_engine import roll_d100
from engine.time_system import format_clock, get_schedule_reminder
from engine.cultivation import compute_combat_power
from gm.offline_gm import resolve_offline_turn

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROMPT_PATH = os.path.join(ROOT_DIR, "prompts", "system_prompt.md")

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(ROOT_DIR, ".env"))
except Exception:
    pass


def _load_system_prompt() -> str:
    if os.path.isfile(PROMPT_PATH):
        with open(PROMPT_PATH, "r", encoding="utf-8") as f:
            return f.read()
    return "Bạn là Quản Trò game nhập vai Cổ Chân Nhân tại Cổ Nguyệt Sơn Trại."


def _build_chunk_context(engine: Any, bundle: Dict[str, Any]) -> str:
    """Chunk Loader: Chỉ nạp đúng vùng hiện tại, NPC đang có mặt (bản sao động), tin đồn, chỉ số & đồng hồ."""
    st = bundle["state"]
    p = st["player"]
    clk = format_clock(st["day"], st["minute_of_day"])
    zone = engine.zones_by_id.get(st["location"], {})
    reminder = get_schedule_reminder(st["minute_of_day"], st["location"], st["schedule"])
    combat = compute_combat_power(p, engine.econ_tpl)

    npcs_by_id = {n["id"]: n for n in bundle["npcs"]}
    scene = st["active_scene"]
    present_info = []
    for nid in scene.get("present_npcs", []):
        n = npcs_by_id.get(nid)
        if n:
            present_info.append({
                "id": n["id"],
                "name": n["name"],
                "rank": n["rank"],
                "faction": n["faction"],
                "personality": n["personality"],
                "public_leak_tendency": n["public_leak_tendency"],
                "status": n["status"],
                "affinity": n["affinity"],
                "impression": n["impression"],
                "current_goal": n["current_goal"],
                "close_contacts": n["close_contacts"],
                "memories": n["memories"][-5:],
            })

    recent_chat = [
        {"role": h["role"], "text": h["text"][:450]}
        for h in bundle["history"][-6:]
    ]

    ctx = {
        "clock": clk["display"],
        "season": clk["season"],
        "day": st["day"],
        "location": {
            "id": zone.get("id"),
            "name": zone.get("name"),
            "description": zone.get("description"),
        },
        "schedule_reminder": reminder["message"],
        "schedule_severity": reminder["severity"],
        "player": {
            "name": p["name"],
            "background": p["background_label"],
            "aptitude": f"{p['aptitude_grade']} đẳng ({p['aptitude_percent']}%)",
            "realm": f"{'Nhất' if p['rank']==1 else 'Nhị'} chuyển {p['sub_realm']} ({combat['essence_color']})",
            "essence_thanh": f"{p['essence_thanh']}/{p['max_thanh']} thành",
            "hp": f"{p['hp']}/{p['max_hp']}",
            "stamina": f"{p['stamina']}/{p['max_stamina']}",
            "stones": p["stones"],
            "boar_strength": p["boar_strength"],
            "combat_power": combat["total"],
            "reputation": p["reputation"],
            "luck": p["luck"],
            "gu_owned": [
                {"id": g["id"], "name": g["name"], "days_until_hungry": g["days_until_hungry"], "starving": g["starving"]}
                for g in p["gu_list"]
            ],
        },
        "active_scene": scene,
        "present_npcs": present_info,
        "village_rumors": bundle["rumors"][:5],
        "recent_history": recent_chat,
    }
    return json.dumps(ctx, ensure_ascii=False, indent=2)


def _call_gemini_json(api_key: str, model_id: str, system_inst: str, user_content: str) -> Dict[str, Any]:
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)
    resp = client.models.generate_content(
        model=model_id,
        contents=user_content,
        config=types.GenerateContentConfig(
            system_instruction=system_inst,
            response_mime_type="application/json",
            temperature=0.75,
        ),
    )
    raw = (resp.text or "").strip()
    # Clean optional code fences
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[-1]
        if raw.endswith("```"):
            raw = raw[:-3]
    return json.loads(raw.strip())


def test_gemini_connection(api_key: str, model_id: str) -> Dict[str, Any]:
    key = (api_key or os.getenv("GEMINI_API_KEY", "")).strip()
    model = (model_id or os.getenv("GEMINI_MODEL", "gemini-2.5-flash")).strip()
    if not key:
        return {"ok": False, "error": "Chưa có GEMINI_API_KEY."}
    try:
        data = _call_gemini_json(
            key,
            model,
            "Trả về JSON ngắn xác nhận kết nối.",
            'Hãy trả về đúng JSON: {"status": "ok", "greeting": "Thiên Đạo Vô Tình đã kết nối."}',
        )
        return {"ok": True, "model": model, "reply": data}
    except Exception as e:
        return {"ok": False, "model": model, "error": str(e)}


def resolve_turn(
    engine: Any,
    bundle: Dict[str, Any],
    user_prompt: str,
    api_key: Optional[str] = None,
    model_id: Optional[str] = None,
    force_offline: bool = False,
) -> Dict[str, Any]:
    key = (api_key or os.getenv("GEMINI_API_KEY", "")).strip()
    model = (model_id or os.getenv("GEMINI_MODEL", "gemini-2.5-flash")).strip()

    if force_offline or not key:
        res = resolve_offline_turn(engine, bundle, user_prompt)
        return res

    sys_prompt = _load_system_prompt()
    chunk_ctx = _build_chunk_context(engine, bundle)

    try:
        # BƯỚC 1: AI thẩm định tình huống -> Target (1-100) & minutes_spent
        eval_prompt = f"""
Dưới đây là ngữ cảnh hiện tại của game (JSON):
{chunk_ctx}

Hành động / lời nói của người chơi (PC):
\"\"\"{user_prompt}\"\"\"

Hãy thẩm định hành động này và trả về DUY NHẤT một JSON object đúng schema sau:
{{
  "requires_roll": true/false (false nếu chỉ là rút lui/trò chuyện đơn giản không rủi ro),
  "target": số nguyên từ 15 đến 98 (ngưỡng độ khó công bằng theo thế giới Cổ Chân Nhân),
  "minutes_spent": số nguyên từ 5 đến 180 (thời gian thực tế tiêu tốn),
  "reasoning": "1 câu tiếng Việt giải thích vì sao đặt ngưỡng Target và thời gian này"
}}
"""
        plan = _call_gemini_json(key, model, sys_prompt, eval_prompt)
        req_roll = bool(plan.get("requires_roll", True))
        target = max(15, min(98, int(plan.get("target", 50))))
        mins = max(5, min(180, int(plan.get("minutes_spent", 20))))

        # BƯỚC 2: CODE THUẦN tung d100 thật & chạy đồng hồ thật!
        dice = roll_d100(target) if req_roll else None
        tick = engine.advance_time(bundle, mins, silent=True)
        clk = format_clock(bundle["state"]["day"], bundle["state"]["minute_of_day"])
        reminder = get_schedule_reminder(
            bundle["state"]["minute_of_day"],
            bundle["state"]["location"],
            bundle["state"]["schedule"],
        )

        # BƯỚC 3: AI miêu tả diễn biến bám sát bậc Delta + cập nhật trạng thái + Đánh giá nhân quả (Câu 6)
        narrate_prompt = f"""
Ngữ cảnh hiện tại:
{chunk_ctx}

Hành động của người chơi:
\"\"\"{user_prompt}\"\"\"

Kết quả CODE THUẦN đã tính xong:
- Thời gian đã trôi: {mins} phút -> Đồng hồ mới: {clk['display']}
- Nhắc lịch trình: {reminder['message']} (Mức độ: {reminder['severity']})
- Kết quả xúc xắc d100: {json.dumps(dice, ensure_ascii=False) if dice else "Không cần tung xúc xắc"}
- Nhật ký hệ thống phát sinh khi trôi thời gian: {json.dumps(tick['logs'], ensure_ascii=False)}

QUAN TRỌNG:
1. Tuyệt đối KHÔNG hành động/nói thay người chơi. Kết thúc lời kể tại điểm chờ quyết định tiếp theo.
2. Bám sát bậc kết quả Delta nếu có xúc xắc. Nếu schedule_severity là 'warn' hoặc 'danger', hãy lồng ghép lời nhắc sắp trễ lịch vào lời dẫn truyện.
3. Chỉ đánh giá trường `impacts` nếu hành động vừa rồi TẠO TÁC ĐỘNG SÂU SẮC tới NPC (hoặc kết thúc cảnh). Dựa vào `personality`, `public_leak_tendency` và `publicity` của cảnh để tự quyết có kích hoạt `propagations` (lan truyền 1 tầng tới `close_contacts`) hay `new_rumor` (tin đồn sơn trại) không!
4. Nếu đang ở sự kiện `dai_hoi_loi_dai` và trận đấu đã phân thắng bại -> đặt `complete_year1: true`.

Trả về DUY NHẤT JSON theo đúng mẫu:
{{
  "narrative": "Đoạn văn nhập vai tiếng Việt 2-4 đoạn, văn phong Cổ Chân Nhân lạnh lùng sâu sắc (dùng markdown nhẹ).",
  "scene_ended": true/false,
  "effects": {{
    "hp_delta": 0,
    "stones_delta": 0,
    "essence_delta": 0.0,
    "reputation_delta": 0,
    "luck_delta": 0,
    "combat_skill_delta": 0,
    "grant_gu_id": null,
    "unlock_zone": null,
    "paying_pn_extortion": null,
    "defied_pn": null,
    "fatal_death": false,
    "death_reason": null,
    "complete_year1": false,
    "exam_final_rank": null,
    "assigned_squad": null
  }},
  "impacts": {{
    "impacted_npcs": [
      {{
        "npc_id": "id_npc_co_trong_present_npcs",
        "affinity_delta": 0,
        "new_impression": "",
        "new_goal": "",
        "new_status": "alive",
        "new_memory": ""
      }}
    ],
    "propagations": [
      {{
        "contact_id": "id_trong_close_contacts",
        "affinity_delta": 0,
        "heard_version": ""
      }}
    ],
    "new_rumor": ""
  }},
  "suggested_actions": ["Gợi ý 1", "Gợi ý 2", "Gợi ý 3"]
}}
"""
        out = _call_gemini_json(key, model, sys_prompt, narrate_prompt)
        return {
            "mode": f"gemini ({model})",
            "plan": {
                "requires_roll": req_roll,
                "target": target,
                "minutes_spent": mins,
                "reasoning": plan.get("reasoning", ""),
            },
            "dice": dice,
            "narrative": out.get("narrative", "Gió núi Thanh Mao thổi qua, mọi việc lắng xuống trong im lặng."),
            "effects": out.get("effects", {}),
            "scene_ended": bool(out.get("scene_ended", False)),
            "impacts": out.get("impacts", {"impacted_npcs": [], "propagations": [], "new_rumor": ""}),
            "suggested_actions": out.get("suggested_actions", [])[:3],
            "triggered_event": tick["triggered_event"],
            "clock_short": clk["short_display"],
        }
    except Exception as e:
        # Fallback êm sang Offline GM nhưng báo rõ lỗi API để người chơi kiểm tra key/model
        fallback = resolve_offline_turn(engine, bundle, user_prompt)
        fallback["api_warning"] = f"Gemini API lỗi ({type(e).__name__}: {str(e)[:140]}) → đã tự chuyển sang Quản Trò Cục Bộ cho lượt này."
        return fallback
