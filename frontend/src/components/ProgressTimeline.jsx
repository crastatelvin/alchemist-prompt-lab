const STEP_LABELS = {
  start: "Run started",
  running: "Model running",
  scoring: "Quality scoring",
  complete: "Run complete",
  error: "Run error",
};

function toneClass(step) {
  if (step === "running") return "running";
  if (step === "scoring") return "scoring";
  if (step === "complete") return "complete";
  return "";
}

export default function ProgressTimeline({ items }) {
  if (!items?.length) return null;

  return (
    <section className="glass-card">
      <div className="panel-title">Run Timeline</div>
      <div className="timeline-list">
        {items.slice(-10).map((item, idx) => (
          <div key={`${item.step || item.event}-${idx}`} className="timeline-item">
            <span className={`timeline-dot ${toneClass(item.step || item.event)}`} />
            <div>
              <div style={{ fontWeight: 600 }}>
                {item.message || STEP_LABELS[item.step] || STEP_LABELS[item.event] || "Update"}
              </div>
              <div className="subtle" style={{ marginTop: 2 }}>
                {item.variant ? `Variant ${item.variant}` : "General"} · {(item.step || item.event || "event").toUpperCase()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
