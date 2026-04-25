export default function TechniqueLibrary({ techniques, onApply }) {
  return (
    <div className="card">
      <strong>Technique Library</strong>
      <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
        {techniques.map((t) => (
          <button key={t.id} onClick={() => onApply(t)} style={{ textAlign: "left", background: "#222", color: "#ddd" }}>
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}
