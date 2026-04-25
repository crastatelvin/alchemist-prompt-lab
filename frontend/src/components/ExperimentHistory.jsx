export default function ExperimentHistory({ experiments }) {
  return (
    <div className="card">
      <strong>History</strong>
      <div style={{ display: "grid", gap: 8, marginTop: 8, maxHeight: 260, overflowY: "auto" }}>
        {experiments.map((e) => (
          <div key={e.id} className="card" style={{ marginBottom: 0 }}>
            <div className="muted">{e.type}</div>
            <div>{e.prompt_a?.slice(0, 90)}</div>
            <div className="muted">A: {e.score_a?.overall || 0} {e.score_b ? `| B: ${e.score_b?.overall || 0}` : ""}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
