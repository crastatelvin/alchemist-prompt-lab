import { motion } from "framer-motion";

export default function PromptEditor({ label, value, onChange, placeholder }) {
  const tokens = Math.ceil(value.length / 4);
  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
        <strong style={{ fontSize: "1.02rem" }}>{label}</strong>
        <span className="score-pill">~{tokens} tokens</span>
      </div>
      <textarea
        className="textarea"
        rows={8}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </motion.div>
  );
}
