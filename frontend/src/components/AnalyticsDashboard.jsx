export default function AnalyticsDashboard({ stats }) {
  const cards = [
    { label: "Experiments", value: stats?.total || 0 },
    { label: "Avg Score", value: stats?.avg_score || 0 },
    { label: "Best Score", value: stats?.best_score || 0 },
    { label: "Avg Latency", value: `${stats?.avg_latency || 0}ms` },
  ];

  return (
    <section className="glass-card">
      <div className="panel-title">Analytics</div>
      <div className="metric-grid">
        {cards.map((card) => (
          <div key={card.label} className="metric-card">
            <div className="metric-label">{card.label}</div>
            <div className="metric-value">{card.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
