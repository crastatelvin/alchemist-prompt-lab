import os
import time
from google import genai

from app.core.config import settings

_client = genai.Client(api_key=settings.gemini_api_key) if settings.gemini_api_key else None


def run_prompt(prompt: str, system_context: str = "") -> dict:
    full_prompt = f"{system_context}\n\n{prompt}" if system_context else prompt
    started = time.time()
    if not _client:
        output = "(Mock output) Configure GEMINI_API_KEY to run live model inference."
        return _payload(output, started, True, "")
    try:
        response = _client.models.generate_content(model=os.getenv("GEMINI_MODEL", "gemini-1.5-flash"), contents=full_prompt)
        return _payload((response.text or "").strip(), started, True, "")
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
