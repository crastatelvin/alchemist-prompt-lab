export default function PromptEditor({ label, value, onChange, placeholder }) {
  const tokens = Math.ceil(value.length / 4);
  return (
    <div className="card" style={{ flex: 1 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <strong>{label}</strong>
        <span className="muted">~{tokens} tokens</span>
      </div>
      <textarea rows={8} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
