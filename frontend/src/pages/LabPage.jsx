import PromptEditor from "../components/PromptEditor";
import TechniqueLibrary from "../components/TechniqueLibrary";
import ResultPanel from "../components/ResultPanel";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import ExperimentHistory from "../components/ExperimentHistory";
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
    <div className="container">
      <div className="panel">
        <div className="card">
          <h2>ALCHEMIST Prompt Engineering Lab</h2>
          <div className="row">
            <button onClick={() => setMode("single")} disabled={mode === "single"}>Single</button>
            <button onClick={() => setMode("ab")} disabled={mode === "ab"}>A/B Test</button>
            <button onClick={run} disabled={running || !promptA.trim()}>{running ? "Running..." : "Run Experiment"}</button>
          </div>
          <div className="muted" style={{ marginTop: 8 }}>{latestLog?.message || "Idle"}</div>
        </div>

        <div className="card">
          <strong>System Context</strong>
          <input value={systemContext} onChange={(e) => setSystemContext(e.target.value)} placeholder="Optional system prompt context" />
        </div>

        <div className="row">
          <PromptEditor label="Prompt A" value={promptA} onChange={setPromptA} placeholder="Enter prompt A" />
          {mode === "ab" && <PromptEditor label="Prompt B" value={promptB} onChange={setPromptB} placeholder="Enter prompt B" />}
        </div>
        {error && <div className="card" style={{ borderColor: "var(--red)" }}>{error}</div>}
        <ResultPanel result={result} />
      </div>

      <div className="panel">
        <AnalyticsDashboard stats={stats} />
        <TechniqueLibrary techniques={techniques} onApply={applyTechnique} />
        <ExperimentHistory experiments={experiments} />
      </div>
    </div>
  );
}
