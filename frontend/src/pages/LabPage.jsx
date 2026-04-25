import { motion } from "framer-motion";
import PromptEditor from "../components/PromptEditor";
import TechniqueLibrary from "../components/TechniqueLibrary";
import ResultPanel from "../components/ResultPanel";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import ExperimentHistory from "../components/ExperimentHistory";
import ProgressTimeline from "../components/ProgressTimeline";
import useExperiment from "../hooks/useExperiment";

export default function LabPage() {
  const {
    promptA,
    promptB,
    systemContext,
    mode,
    running,
    result,
    experiments,
    stats,
    techniques,
    error,
    wsLog,
    setPromptA,
    setPromptB,
    setSystemContext,
    setMode,
    run,
    applyTechnique,
  } = useExperiment();

  const latestLog = wsLog[wsLog.length - 1];

  return (
    <div className="app-shell">
      <div className="premium-grid">
        <div className="left-panel">
          <motion.section
            className="glass-card header-card"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <h2 className="header-title">ALCHEMIST Prompt Engineering Lab</h2>
            <div className="subtle">
              Tune prompts with controlled experiments, live scoring, and side-by-side output quality.
            </div>
            <div className="controls-row">
              <button
                className={`chip-button ${mode === "single" ? "active" : ""}`}
                onClick={() => setMode("single")}
                disabled={mode === "single"}
              >
                Single
              </button>
              <button
                className={`chip-button ${mode === "ab" ? "active" : ""}`}
                onClick={() => setMode("ab")}
                disabled={mode === "ab"}
              >
                A/B Test
              </button>
              <button className="run-button" onClick={run} disabled={running || !promptA.trim()}>
                {running ? "Running..." : "Run Experiment"}
              </button>
            </div>
            <div className="progress-line">
              <span className="pulse-dot" />
              {latestLog?.message || "Idle"}
            </div>
          </motion.section>

          <section className="glass-card">
            <div className="field-label">System Context</div>
            <input
              className="input"
              value={systemContext}
              onChange={(e) => setSystemContext(e.target.value)}
              placeholder="Optional system prompt context"
            />
          </section>

          <div className="editors-grid">
            <PromptEditor
              label="Prompt A"
              value={promptA}
              onChange={setPromptA}
              placeholder="Design your primary prompt variant..."
            />
            {mode === "ab" && (
              <PromptEditor
                label="Prompt B"
                value={promptB}
                onChange={setPromptB}
                placeholder="Design your challenger prompt variant..."
              />
            )}
          </div>

          {error && <div className="glass-card error-banner">{error}</div>}

          <ProgressTimeline items={wsLog} />

          <ResultPanel result={result} />
        </div>

        <div className="right-panel">
          <AnalyticsDashboard stats={stats} />
          <TechniqueLibrary techniques={techniques} onApply={applyTechnique} />
          <ExperimentHistory experiments={experiments} />
        </div>
      </div>
    </div>
  );
}
