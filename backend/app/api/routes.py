import json

from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import require_api_key
from app.db.database import get_db
from app.db.models import VariantResult
from app.db.schemas import RunRequest
from app.services.experiment_runner import run_ab_test, run_single
from app.services.repository import get_stats, list_experiments, save_experiment
from app.services.technique_library import get_all_techniques, get_technique

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)
connections: list[WebSocket] = []
db_dependency = Depends(get_db)
api_key_dependency = Depends(require_api_key)


async def broadcast(data: dict):
    for ws in connections[:]:
        try:
            await ws.send_text(json.dumps(data))
        except Exception:
            if ws in connections:
                connections.remove(ws)


@router.websocket("/ws")
async def ws_endpoint(websocket: WebSocket):
    await websocket.accept()
    connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        if websocket in connections:
            connections.remove(websocket)


@router.get("/")
def root():
    return {"status": "ALCHEMIST ONLINE", "version": "1.0.0"}


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/ready")
def ready():
    return {"status": "ready", "env": settings.app_env}


@router.post("/run")
async def run_experiment(
    payload: RunRequest,
    db: Session = db_dependency,
    _: None = api_key_dependency,
):
    await broadcast(
        {"event": "start", "mode": payload.mode, "message": f"Starting {payload.mode} run"}
    )
    if payload.mode == "ab" and payload.prompt_b:
        result_a, score_a, result_b, score_b, winner, margin = await run_ab_test(
            payload.prompt_a, payload.prompt_b, payload.system_context, broadcast
        )
        exp = save_experiment(
            db,
            "ab",
            payload.prompt_a,
            payload.prompt_b,
            winner,
            margin,
            result_a,
            score_a,
            result_b,
            score_b,
        )
    else:
        result_a, score_a = await run_single(payload.prompt_a, payload.system_context, broadcast)
        exp = save_experiment(
            db, "single", payload.prompt_a, payload.prompt_b, None, None, result_a, score_a
        )

    variants = {v.label: v for v in exp.variants}
    result = {
        "id": exp.id,
        "type": "ab_test" if exp.mode == "ab" else "single",
        "mode": exp.mode,
        "prompt_a": exp.prompt_a,
        "prompt_b": exp.prompt_b,
        "winner": exp.winner,
        "margin": exp.margin,
        "result_a": _variant_result(variants.get("A")),
        "score_a": _variant_score(variants.get("A")),
        "result_b": _variant_result(variants.get("B")) if variants.get("B") else None,
        "score_b": _variant_score(variants.get("B")) if variants.get("B") else None,
    }
    return JSONResponse(result)


@router.get("/experiments")
def experiments(
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = db_dependency,
    _: None = api_key_dependency,
):
    data = []
    for exp in list_experiments(db, limit):
        variants = {v.label: v for v in exp.variants}
        data.append(
            {
                "id": exp.id,
                "type": "ab_test" if exp.mode == "ab" else "single",
                "mode": exp.mode,
                "prompt_a": exp.prompt_a,
                "prompt_b": exp.prompt_b,
                "winner": exp.winner,
                "margin": exp.margin,
                "created_at": exp.created_at.isoformat(),
                "score_a": _variant_score(variants.get("A")),
                "score_b": _variant_score(variants.get("B")) if variants.get("B") else None,
                "result_a": _variant_result(variants.get("A")),
                "result_b": _variant_result(variants.get("B")) if variants.get("B") else None,
            }
        )
    return JSONResponse(data)


@router.get("/stats")
def stats(db: Session = db_dependency, _: None = api_key_dependency):
    return JSONResponse(get_stats(db))


@router.get("/techniques")
def techniques(_: None = api_key_dependency):
    return JSONResponse(get_all_techniques())


@router.get("/techniques/{technique_id}")
def technique_by_id(technique_id: str, _: None = api_key_dependency):
    t = get_technique(technique_id)
    if not t:
        return JSONResponse(status_code=404, content={"error": "Technique not found"})
    return JSONResponse(t)


def _variant_result(v: VariantResult | None):
    if not v:
        return None
    return {
        "output": v.output,
        "latency_ms": v.latency_ms,
        "word_count": v.word_count,
        "char_count": v.char_count,
    }


def _variant_score(v: VariantResult | None):
    if not v:
        return None
    return {
        "relevance": v.relevance,
        "completeness": v.completeness,
        "accuracy": v.accuracy,
        "clarity": v.clarity,
        "structure": v.structure,
        "conciseness": v.conciseness,
        "overall": v.overall,
        "verdict": v.verdict,
    }
