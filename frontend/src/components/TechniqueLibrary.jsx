export default function TechniqueLibrary({ techniques, onApply }) {
  return (
    <section className="glass-card">
      <div className="panel-title">Technique Library</div>
      <div className="tech-grid">
        {techniques.map((t) => (
          <button key={t.id} className="tech-item" onClick={() => onApply(t)}>
            <div style={{ fontWeight: 700 }}>{t.name}</div>
            <div className="subtle" style={{ marginTop: 4 }}>
              {t.description}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
