from datetime import datetime
from pydantic import BaseModel, Field


class RunRequest(BaseModel):
    mode: str = Field(default="single", pattern="^(single|ab)$")
    prompt_a: str = Field(min_length=1, max_length=12000)
    prompt_b: str | None = Field(default=None, max_length=12000)
    system_context: str = Field(default="", max_length=3000)


class VariantPayload(BaseModel):
    output: str
    latency_ms: float
    word_count: int
    char_count: int


class ScorePayload(BaseModel):
    relevance: int
    completeness: int
    accuracy: int
    clarity: int
    structure: int
    conciseness: int
    overall: int
    verdict: str


class ExperimentResponse(BaseModel):
    id: int
    mode: str
    prompt_a: str
    prompt_b: str | None = None
    winner: str | None = None
    margin: float | None = None
    created_at: datetime
    result_a: VariantPayload
    score_a: ScorePayload
    result_b: VariantPayload | None = None
    score_b: ScorePayload | None = None
