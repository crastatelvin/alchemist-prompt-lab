import { useCallback, useEffect, useState } from "react";
import { getExperiments, getStats, getTechniques, runExperiment } from "../services/api";

export default function useExperiment() {
  const [promptA, setPromptA] = useState("");
  const [promptB, setPromptB] = useState("");
  const [systemContext, setSystemContext] = useState("");
  const [mode, setMode] = useState("single");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [experiments, setExperiments] = useState([]);
  const [stats, setStats] = useState({});
  const [techniques, setTechniques] = useState([]);
  const [error, setError] = useState("");
  const [wsLog, setWsLog] = useState([]);

  const load = useCallback(async () => {
    const [exp, st, tech] = await Promise.all([getExperiments(), getStats(), getTechniques()]);
    setExperiments(exp);
    setStats(st);
    setTechniques(tech);
  }, []);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  const run = useCallback(async () => {
    if (!promptA.trim() || running) return;
    setRunning(true);
    setError("");
    setResult(null);
    setWsLog([]);
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws";
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
      try {
        setWsLog((prev) => [...prev, JSON.parse(event.data)]);
      } catch {
        // no-op
      }
    };
    try {
      const payload = { mode, prompt_a: promptA, prompt_b: mode === "ab" ? promptB : null, system_context: systemContext };
      const res = await runExperiment(payload);
      setResult(res);
      await load();
    } catch {
      setError("Run failed. Check backend connectivity and API key.");
    } finally {
      ws.close();
      setRunning(false);
    }
  }, [promptA, promptB, systemContext, mode, running, load]);

  const applyTechnique = useCallback(
    (tech) => {
      setPromptA(tech.example || tech.template || "");
      if (mode === "ab") setPromptB(tech.template || "");
    },
    [mode]
  );

  return {
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
  };
}
