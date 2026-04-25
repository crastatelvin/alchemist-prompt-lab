export default function ExperimentHistory({ experiments }) {
  return (
    <section className="glass-card">
      <div className="panel-title">History</div>
      <div className="history-list">
        {experiments.map((e) => (
          <div key={e.id} className="history-item">
            <div className="subtle" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {e.type === "ab_test" ? "A/B test" : "Single run"}
            </div>
            <div style={{ margin: "4px 0 8px", lineHeight: 1.45 }}>{e.prompt_a?.slice(0, 100)}</div>
            <div className="subtle">
              A: {e.score_a?.overall || 0}
              {e.score_b ? ` | B: ${e.score_b?.overall || 0}` : ""}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
