import time

from groq import Groq

from app.core.config import settings

_client = Groq(api_key=settings.groq_api_key) if settings.groq_api_key else None


def run_prompt(prompt: str, system_context: str = "") -> dict:
    started = time.time()
    if not _client:
        output = "(Mock output) Configure GROQ_API_KEY to run live model inference."
        return _payload(output, started, True, "")

    messages = []
    if system_context.strip():
        messages.append({"role": "system", "content": system_context})
    messages.append({"role": "user", "content": prompt})

    try:
        completion = _client.chat.completions.create(
            model=settings.groq_model,
            messages=messages,
            temperature=0.2,
        )
        text = (completion.choices[0].message.content or "").strip()
        return _payload(text, started, True, "")
    except Exception as exc:
        return _payload("", started, False, str(exc)[:240])


def _payload(text: str, started: float, success: bool, error: str) -> dict:
    return {
        "output": text,
        "latency_ms": round((time.time() - started) * 1000, 2),
        "word_count": len(text.split()),
        "char_count": len(text),
        "success": success,
        "error": error,
    }
