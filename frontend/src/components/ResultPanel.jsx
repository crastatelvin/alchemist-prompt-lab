export default function ResultPanel({ result }) {
  if (!result) return null;
  const isAB = result.mode === "ab" || result.type === "ab_test";
  return (
    <div className="card">
      <strong>{isAB ? `Winner: Variant ${result.winner} (+${result.margin})` : "Single Run Result"}</strong>
      <div className="row" style={{ marginTop: 10 }}>
        <div className="card" style={{ flex: 1 }}>
          <div className="score">{result.score_a?.overall ?? 0}</div>
          <div className="muted">{result.score_a?.verdict}</div>
          <p>{result.result_a?.output}</p>
        </div>
        {isAB && (
          <div className="card" style={{ flex: 1 }}>
            <div className="score">{result.score_b?.overall ?? 0}</div>
            <div className="muted">{result.score_b?.verdict}</div>
            <p>{result.result_b?.output}</p>
          </div>
        )}
      </div>
    </div>
  );
}
