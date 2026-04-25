import { motion } from "framer-motion";
import { useMemo, useState } from "react";

function renderStructuredOutput(text) {
  if (!text) return <p className="structured-line">No output generated yet.</p>;
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const elements = [];
  let currentList = [];

  const flushList = () => {
    if (currentList.length) {
      elements.push(
        <ul key={`list-${elements.length}`} className="structured-list">
          {currentList.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line) => {
    const bulletMatch = line.match(/^[-*•]\s+(.*)$/);
    const numberedMatch = line.match(/^\d+[\).\s-]+(.*)$/);
    if (bulletMatch || numberedMatch) {
      currentList.push((bulletMatch || numberedMatch)[1]);
      return;
    }
    flushList();
    elements.push(
      <p key={`line-${elements.length}`} className="structured-line">
        {line}
      </p>
    );
  });

  flushList();
  return elements;
}

function scoreTone(score) {
  if (score >= 80) return "#19d3a2";
  if (score >= 65) return "#8ec5ff";
  if (score >= 45) return "#f4b019";
  return "#ff6b6b";
}

const DIMENSIONS = [
  ["relevance", "Relevance"],
  ["completeness", "Completeness"],
  ["accuracy", "Accuracy"],
  ["clarity", "Clarity"],
  ["structure", "Structure"],
  ["conciseness", "Conciseness"],
];

function ScoreBars({ score }) {
  return (
    <div className="score-bars">
      {DIMENSIONS.map(([key, label], index) => {
        const value = score?.[key] ?? 0;
        return (
          <div key={key} className="score-bar-row">
            <span className="subtle">{label}</span>
            <div className="score-bar-track">
              <motion.div
                className="score-bar-fill"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: Math.max(0.01, value / 100) }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                style={{ background: scoreTone(value) }}
              />
            </div>
            <span className="subtle">{value}</span>
          </div>
        );
      })}
    </div>
  );
}

function diffTokens(aText, bText) {
  const a = (aText || "").split(/\s+/).filter(Boolean);
  const b = (bText || "").split(/\s+/).filter(Boolean);
  const bSet = new Set(b);
  const aSet = new Set(a);
  const removed = a.filter((w) => !bSet.has(w)).slice(0, 60);
  const added = b.filter((w) => !aSet.has(w)).slice(0, 60);
  return { removed, added };
}

export default function ResultPanel({ result }) {
  if (!result) return null;
  const isAB = result.mode === "ab" || result.type === "ab_test";
  const [showDiff, setShowDiff] = useState(false);

  const diffs = useMemo(() => {
    if (!isAB) return { removed: [], added: [] };
    return diffTokens(result.result_a?.output, result.result_b?.output);
  }, [isAB, result]);

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text || "");
    } catch {
      // no-op
    }
  };

  return (
    <motion.section
      className="glass-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div className="panel-title" style={{ margin: 0 }}>
          {isAB ? `Winner: Variant ${result.winner} (+${result.margin})` : "Single Run Result"}
        </div>
        <span className="score-pill">
          {isAB ? "Comparative mode" : "Single mode"}
        </span>
      </div>

      <div className="results-grid">
        <div className="glass-card" style={{ margin: 0 }}>
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <strong>Variant A</strong>
            <span style={{ color: scoreTone(result.score_a?.overall ?? 0), fontSize: "1.4rem", fontWeight: 800 }}>
              {result.score_a?.overall ?? 0}
            </span>
          </div>
          <div className="subtle" style={{ marginTop: 4 }}>
            {result.score_a?.verdict || "No verdict"}
          </div>
          <ScoreBars score={result.score_a} />
          <div className="result-output">{renderStructuredOutput(result.result_a?.output)}</div>
          <div className="result-actions">
            <button className="ghost-button" onClick={() => copyText(result.result_a?.output)}>
              Copy Variant A
            </button>
          </div>
        </div>
        {isAB && (
          <div className="glass-card" style={{ margin: 0 }}>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <strong>Variant B</strong>
              <span style={{ color: scoreTone(result.score_b?.overall ?? 0), fontSize: "1.4rem", fontWeight: 800 }}>
                {result.score_b?.overall ?? 0}
              </span>
            </div>
            <div className="subtle" style={{ marginTop: 4 }}>
              {result.score_b?.verdict || "No verdict"}
            </div>
            <ScoreBars score={result.score_b} />
            <div className="result-output">{renderStructuredOutput(result.result_b?.output)}</div>
            <div className="result-actions">
              <button className="ghost-button" onClick={() => copyText(result.result_b?.output)}>
                Copy Variant B
              </button>
              <button className="ghost-button" onClick={() => setShowDiff((v) => !v)}>
                {showDiff ? "Hide Diff" : "Compare Diff"}
              </button>
            </div>
            {showDiff && (
              <div className="diff-box">
                <div className="subtle" style={{ marginBottom: 8 }}>
                  Added in B
                </div>
                <div style={{ marginBottom: 10 }}>
                  {diffs.added.length ? (
                    diffs.added.map((token, idx) => (
                      <span key={`a-${token}-${idx}`} className="diff-token added">
                        {token}
                      </span>
                    ))
                  ) : (
                    <span className="subtle">No distinct additions detected.</span>
                  )}
                </div>
                <div className="subtle" style={{ marginBottom: 8 }}>
                  Missing from B (present in A)
                </div>
                <div>
                  {diffs.removed.length ? (
                    diffs.removed.map((token, idx) => (
                      <span key={`r-${token}-${idx}`} className="diff-token removed">
                        {token}
                      </span>
                    ))
                  ) : (
                    <span className="subtle">No distinct removals detected.</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
}
