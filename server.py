# -*- coding: utf-8 -*-
"""
Web Server (Starlette + Uvicorn) cho Cổ Chân Nhân: Cổ Nguyệt Sơn Trại (Năm Thứ Nhất).
Phục vụ giao diện Web Game tại http://127.0.0.1:8000 và API cho Engine Python + Gemini AI Studio.
"""

import os
import uuid
from typing import Any, Dict

import uvicorn
from starlette.applications import Starlette
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import FileResponse, JSONResponse
from starlette.routing import Mount, Route
from starlette.staticfiles import StaticFiles

from engine.world_engine import WorldEngine
from gm.gemini_gm import resolve_turn, test_gemini_connection

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(ROOT_DIR, ".env"))
except Exception:
    pass

engine = WorldEngine()


async def _read_json(request: Request) -> Dict[str, Any]:
    try:
        return await request.json()
    except Exception:
        return {}


async def index_page(request: Request):
    return FileResponse(os.path.join(PUBLIC_DIR, "index.html"))


async def api_config(request: Request):
    return JSONResponse({
        "has_env_key": bool(os.getenv("GEMINI_API_KEY", "").strip()),
        "default_model": os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
        "gu_total": len(engine.gu_db),
        "zones_total": len(engine.world_map_tpl["zones"]),
        "npcs_total": len(engine.npcs_tpl["npcs"]),
    })


async def api_test_gemini(request: Request):
    body = await _read_json(request)
    res = test_gemini_connection(body.get("api_key", ""), body.get("model_id", ""))
    return JSONResponse(res)


async def api_list_runs(request: Request):
    return JSONResponse({"runs": engine.list_runs()})


async def api_create_run(request: Request):
    body = await _read_json(request)
    bundle = engine.create_run(
        name=body.get("name", "Cổ Nguyệt Trần"),
        background=body.get("background", "orphan"),
        aptitude_percent=int(body.get("aptitude_percent", 44)),
        initial_goal=body.get("goal", "Tích lũy nguyên thạch và đột phá tu vi trước Đại Hội Sát Hạch"),
    )
    return JSONResponse(bundle)


async def api_get_run(request: Request):
    run_id = request.path_params["run_id"]
    try:
        return JSONResponse(engine.get_full_bundle(run_id))
    except FileNotFoundError as e:
        return JSONResponse({"error": str(e)}, status_code=404)


async def api_move(request: Request):
    run_id = request.path_params["run_id"]
    body = await _read_json(request)
    target = body.get("target_zone_id", "")
    res = engine.move_to_zone(run_id, target)
    return JSONResponse(res)


async def api_schedule(request: Request):
    run_id = request.path_params["run_id"]
    body = await _read_json(request)
    mode = body.get("mode", "block")
    res = engine.run_schedule(run_id, mode=mode)
    return JSONResponse(res)


async def api_quick_action(request: Request):
    run_id = request.path_params["run_id"]
    body = await _read_json(request)
    action = body.get("action", "")
    res = engine.quick_action(run_id, action, body)
    return JSONResponse(res)


async def api_turn(request: Request):
    run_id = request.path_params["run_id"]
    body = await _read_json(request)
    user_prompt = str(body.get("prompt", "")).strip()
    if not user_prompt:
        return JSONResponse({"error": "Vui lòng nhập hành động hoặc lời nói."}, status_code=400)

    bundle = engine.load_bundle(run_id)
    st = bundle["state"]
    if st["status"] != "active":
        return JSONResponse({"error": "Lượt chơi đã kết thúc.", "bundle": engine.get_full_bundle(run_id)})

    # Ghi tin nhắn người chơi vào lịch sử
    from engine.time_system import format_clock
    clk_before = format_clock(st["day"], st["minute_of_day"])
    bundle["history"].append({
        "id": uuid.uuid4().hex[:8],
        "role": "player",
        "kind": "prompt",
        "clock": clk_before["short_display"],
        "text": user_prompt,
    })

    # Gọi GM (Gemini AI Studio hoặc Offline fallback)
    result = resolve_turn(
        engine=engine,
        bundle=bundle,
        user_prompt=user_prompt,
        api_key=body.get("api_key"),
        model_id=body.get("model_id"),
        force_offline=bool(body.get("force_offline", False)),
    )

    # Áp dụng biến đổi trạng thái (Code thuần kẹp biên độ + Permadeath check)
    effect_notes = engine.apply_turn_effects(bundle, result.get("effects", {}))

    # Áp dụng đánh giá nhân quả cuối cảnh (Câu 6: NPC động + A/C có điều kiện)
    impact_notes = engine.apply_scene_impacts(bundle, result.get("impacts", {}))

    # Cập nhật trạng thái cảnh
    scene = st["active_scene"]
    scene["scene_turns"] = scene.get("scene_turns", 0) + 1
    if result.get("scene_ended"):
        scene["in_scene"] = False
        ev_id = scene.get("event_id")
        if ev_id:
            for ev in bundle["timeline"]:
                if ev["id"] == ev_id:
                    ev["status"] = "done"

    # Lưu kết quả vào lịch sử hội thoại
    bundle["history"].append({
        "id": uuid.uuid4().hex[:8],
        "role": "gm",
        "kind": "turn",
        "mode": result.get("mode", "offline"),
        "clock": result.get("clock_short", clk_before["short_display"]),
        "plan": result.get("plan"),
        "dice": result.get("dice"),
        "text": result.get("narrative", ""),
        "effect_notes": effect_notes,
        "impact_notes": impact_notes,
        "api_warning": result.get("api_warning"),
        "suggested_actions": result.get("suggested_actions", []),
    })

    # Nếu quá trình trôi thời gian vừa kích hoạt thêm sự kiện lớn mới và người chơi còn sống
    if result.get("triggered_event") and st["status"] == "active":
        engine.trigger_timeline_scene(bundle, result["triggered_event"])

    engine.save_bundle(run_id, bundle)
    return JSONResponse({
        "mode": result.get("mode"),
        "dice": result.get("dice"),
        "effect_notes": effect_notes,
        "impact_notes": impact_notes,
        "api_warning": result.get("api_warning"),
        "bundle": engine.get_full_bundle(run_id),
    })


async def api_gu_encyclopedia(request: Request):
    q = (request.query_params.get("q") or "").lower().strip()
    rank = (request.query_params.get("rank") or "").lower().strip()
    items = []
    for g in engine.gu_db:
        if q and q not in g["ten_goi"].lower() and q not in g.get("cong_nang_cu_the", "").lower():
            continue
        if rank and rank not in g.get("pham_cap", "").lower():
            continue
        items.append(g)
    return JSONResponse({"total": len(items), "items": items[:100]})


routes = [
    Route("/", index_page),
    Route("/api/config", api_config),
    Route("/api/test_gemini", api_test_gemini, methods=["POST"]),
    Route("/api/runs", api_list_runs),
    Route("/api/runs/new", api_create_run, methods=["POST"]),
    Route("/api/runs/{run_id}", api_get_run),
    Route("/api/runs/{run_id}/move", api_move, methods=["POST"]),
    Route("/api/runs/{run_id}/schedule", api_schedule, methods=["POST"]),
    Route("/api/runs/{run_id}/action", api_quick_action, methods=["POST"]),
    Route("/api/runs/{run_id}/turn", api_turn, methods=["POST"]),
    Route("/api/gu", api_gu_encyclopedia),
    Mount("/static", app=StaticFiles(directory=PUBLIC_DIR), name="static"),
]

app = Starlette(routes=routes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    print(f"\n=== CO CHAN NHAN: CO NGUYET SON TRAI (NAM 1) ===")
    print(f"Mo trinh duyet tai: http://127.0.0.1:{port}\n")
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="info")
