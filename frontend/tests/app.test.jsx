import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App";

describe("App", () => {
  it("renders title", () => {
    render(<App />);
    expect(screen.getByText(/ALCHEMIST Prompt Engineering Lab/i)).toBeTruthy();
  });
});
