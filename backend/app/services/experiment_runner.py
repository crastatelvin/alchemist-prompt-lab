from app.services.groq_service import run_prompt
from app.services.prompt_scorer import score_response


async def run_single(prompt: str, system_context: str, broadcast_fn):
    await broadcast_fn({"step": "running", "variant": "A", "message": "Running prompt A..."})
    result_a = run_prompt(prompt, system_context)
    await broadcast_fn({"step": "scoring", "variant": "A", "message": "Scoring response A..."})
    score_a = score_response(prompt, result_a["output"])
    await broadcast_fn({"step": "complete", "message": f"Score: {score_a['overall']}/100"})
    return result_a, score_a


async def run_ab_test(prompt_a: str, prompt_b: str, system_context: str, broadcast_fn):
    await broadcast_fn({"step": "running", "variant": "A", "message": "Running variant A..."})
    result_a = run_prompt(prompt_a, system_context)
    await broadcast_fn({"step": "scoring", "variant": "A", "message": "Scoring variant A..."})
    score_a = score_response(prompt_a, result_a["output"])
    await broadcast_fn({"step": "running", "variant": "B", "message": "Running variant B..."})
    result_b = run_prompt(prompt_b, system_context)
    await broadcast_fn({"step": "scoring", "variant": "B", "message": "Scoring variant B..."})
    score_b = score_response(prompt_b, result_b["output"])
    winner = "A" if score_a["overall"] >= score_b["overall"] else "B"
    margin = abs(score_a["overall"] - score_b["overall"])
    await broadcast_fn(
        {"step": "complete", "winner": winner, "message": f"Winner: {winner} (+{margin})"}
    )
    return result_a, score_a, result_b, score_b, winner, margin
