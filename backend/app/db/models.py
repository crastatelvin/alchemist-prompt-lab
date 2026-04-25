from datetime import datetime
from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Experiment(Base):
    __tablename__ = "experiments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    mode: Mapped[str] = mapped_column(String(16), default="single")
    prompt_a: Mapped[str] = mapped_column(Text)
    prompt_b: Mapped[str | None] = mapped_column(Text, nullable=True)
    winner: Mapped[str | None] = mapped_column(String(2), nullable=True)
    margin: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    variants: Mapped[list["VariantResult"]] = relationship(
        back_populates="experiment", cascade="all, delete-orphan"
    )


class VariantResult(Base):
    __tablename__ = "variant_results"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    experiment_id: Mapped[int] = mapped_column(ForeignKey("experiments.id", ondelete="CASCADE"))
    label: Mapped[str] = mapped_column(String(1))
    output: Mapped[str] = mapped_column(Text, default="")
    latency_ms: Mapped[float] = mapped_column(Float, default=0)
    word_count: Mapped[int] = mapped_column(Integer, default=0)
    char_count: Mapped[int] = mapped_column(Integer, default=0)
    relevance: Mapped[int] = mapped_column(Integer, default=0)
    completeness: Mapped[int] = mapped_column(Integer, default=0)
    accuracy: Mapped[int] = mapped_column(Integer, default=0)
    clarity: Mapped[int] = mapped_column(Integer, default=0)
    structure: Mapped[int] = mapped_column(Integer, default=0)
    conciseness: Mapped[int] = mapped_column(Integer, default=0)
    overall: Mapped[int] = mapped_column(Integer, default=0)
    verdict: Mapped[str] = mapped_column(Text, default="")
    experiment: Mapped["Experiment"] = relationship(back_populates="variants")
