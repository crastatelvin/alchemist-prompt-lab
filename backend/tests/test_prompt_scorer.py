from app.services.prompt_scorer import _parse


def test_parse_scores():
    sample = """RELEVANCE_SCORE: 80
COMPLETENESS_SCORE: 70
ACCURACY_SCORE: 90
CLARITY_SCORE: 85
STRUCTURE_SCORE: 78
CONCISENESS_SCORE: 60
VERDICT: Good response."""
    parsed = _parse(sample)
    assert parsed is not None
    assert parsed["overall"] > 0
    assert parsed["relevance"] == 80
