import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App";

vi.mock("../src/services/api", () => ({
  getExperiments: vi.fn().mockResolvedValue([]),
  getStats: vi.fn().mockResolvedValue({ total: 0, avg_score: 0, best_score: 0, avg_latency: 0 }),
  getTechniques: vi.fn().mockResolvedValue([]),
  runExperiment: vi.fn(),
}));

describe("App", () => {
  it("renders title", () => {
    render(<App />);
    expect(screen.getByText(/ALCHEMIST Prompt Engineering Lab/i)).toBeTruthy();
  });
});
