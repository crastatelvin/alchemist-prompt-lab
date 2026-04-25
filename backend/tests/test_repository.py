from app.db.database import SessionLocal
from app.services.repository import get_stats, save_experiment


def test_repository_save_and_stats():
    db = SessionLocal()
    try:
        save_experiment(
            db=db,
            mode="single",
            prompt_a="Explain recursion",
            prompt_b=None,
            winner=None,
            margin=None,
            result_a={
                "output": "Recursion is self-reference.",
                "latency_ms": 12,
                "word_count": 4,
                "char_count": 28,
            },
            score_a={
                "relevance": 80,
                "completeness": 75,
                "accuracy": 85,
                "clarity": 78,
                "structure": 70,
                "conciseness": 88,
                "overall": 79,
                "verdict": "Good",
            },
        )
        stats = get_stats(db)
        assert stats["total"] >= 1
        assert stats["best_score"] >= 79
    finally:
        db.close()
