export default function AnalyticsDashboard({ stats }) {
  return (
    <div className="card">
      <strong>Analytics</strong>
      <div className="row" style={{ marginTop: 8 }}>
        <div className="card"><div className="muted">Experiments</div><div className="score">{stats?.total || 0}</div></div>
        <div className="card"><div className="muted">Avg Score</div><div className="score">{stats?.avg_score || 0}</div></div>
      </div>
      <div className="row">
        <div className="card"><div className="muted">Best Score</div><div className="score">{stats?.best_score || 0}</div></div>
        <div className="card"><div className="muted">Avg Latency</div><div className="score">{stats?.avg_latency || 0}ms</div></div>
      </div>
    </div>
  );
}
