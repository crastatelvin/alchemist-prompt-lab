from sqlalchemy import desc, func
from sqlalchemy.orm import Session

from app.db.models import Experiment, VariantResult


def save_experiment(
    db: Session,
    mode: str,
    prompt_a: str,
    prompt_b: str | None,
    winner: str | None,
    margin: float | None,
    result_a: dict,
    score_a: dict,
    result_b: dict | None = None,
    score_b: dict | None = None,
) -> Experiment:
    exp = Experiment(mode=mode, prompt_a=prompt_a, prompt_b=prompt_b, winner=winner, margin=margin)
    db.add(exp)
    db.flush()
    _add_variant(db, exp.id, "A", result_a, score_a)
    if result_b and score_b:
        _add_variant(db, exp.id, "B", result_b, score_b)
    db.commit()
    db.refresh(exp)
    return exp


def _add_variant(db: Session, exp_id: int, label: str, result: dict, score: dict):
    db.add(
        VariantResult(
            experiment_id=exp_id,
            label=label,
            output=result.get("output", ""),
            latency_ms=result.get("latency_ms", 0),
            word_count=result.get("word_count", 0),
            char_count=result.get("char_count", 0),
            relevance=score.get("relevance", 0),
            completeness=score.get("completeness", 0),
            accuracy=score.get("accuracy", 0),
            clarity=score.get("clarity", 0),
            structure=score.get("structure", 0),
            conciseness=score.get("conciseness", 0),
            overall=score.get("overall", 0),
            verdict=score.get("verdict", ""),
        )
    )


def list_experiments(db: Session, limit: int = 20) -> list[Experiment]:
    return db.query(Experiment).order_by(desc(Experiment.created_at)).limit(limit).all()


def get_stats(db: Session) -> dict:
    total = db.query(func.count(Experiment.id)).scalar() or 0
    rows = db.query(VariantResult.overall, VariantResult.latency_ms).all()
    scores = [r[0] for r in rows if r[0] > 0]
    latencies = [r[1] for r in rows if r[1] > 0]
    trend_rows = db.query(VariantResult.overall).order_by(desc(VariantResult.id)).limit(10).all()
    return {
        "total": total,
        "avg_score": round(sum(scores) / len(scores), 1) if scores else 0,
        "best_score": max(scores) if scores else 0,
        "avg_latency": round(sum(latencies) / len(latencies), 0) if latencies else 0,
        "score_trend": [r[0] for r in trend_rows][::-1],
    }
