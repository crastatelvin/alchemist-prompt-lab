import re
from app.services.gemini_service import run_prompt

WEIGHTS = {"relevance": 0.20, "completeness": 0.20, "accuracy": 0.20, "clarity": 0.15, "structure": 0.15, "conciseness": 0.10}


def score_response(prompt: str, response: str) -> dict:
    if not response.strip():
        return _zero()
    score_prompt = (
        "Score this AI response from 0-100 on relevance, completeness, accuracy, "
        "clarity, structure, conciseness. Return lines: RELEVANCE_SCORE: n ... VERDICT: text.\n\n"
        f"PROMPT:\n{prompt[:700]}\n\nRESPONSE:\n{response[:1500]}"
    )
    model_result = run_prompt(score_prompt)
    parsed = _parse(model_result.get("output", ""))
    if parsed:
        return parsed
    return _heuristic(prompt, response)


def _parse(text: str) -> dict | None:
    if not text:
        return None
    out = {k: 70 for k in WEIGHTS}
    out["verdict"] = ""
    for line in text.splitlines():
        for key in WEIGHTS:
            token = f"{key.upper()}_SCORE:"
            if token in line.upper():
                nums = re.findall(r"\d+", line)
                if nums:
                    out[key] = max(0, min(100, int(nums[-1])))
        if line.upper().startswith("VERDICT:"):
            out["verdict"] = line.split(":", 1)[-1].strip()
    out["overall"] = round(sum(out[k] * WEIGHTS[k] for k in WEIGHTS))
    return out


def _heuristic(prompt: str, response: str) -> dict:
    words = len(response.split())
    overlap = len(set(prompt.lower().split()) & set(response.lower().split())) / max(len(set(prompt.lower().split())), 1)
    scores = {
        "relevance": min(100, int(overlap * 140 + 45)),
        "completeness": 65,
        "accuracy": 68,
        "clarity": min(100, 55 + min(45, words // 5)),
        "structure": 70 if ("\n" in response or "-" in response) else 60,
        "conciseness": max(30, 100 - max(0, words - 220) // 4),
        "verdict": "Heuristic evaluation used because AI scoring output could not be parsed.",
    }
    scores["overall"] = round(sum(scores[k] * WEIGHTS[k] for k in WEIGHTS))
    return scores


def _zero() -> dict:
    return {"relevance": 0, "completeness": 0, "accuracy": 0, "clarity": 0, "structure": 0, "conciseness": 0, "overall": 0, "verdict": "No response to evaluate"}
