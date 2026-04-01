import { describe, it, expect } from "vitest";
import { getGaugeConfig } from "@/components/overall-gauge";

describe("getGaugeConfig", () => {
  it("returns correct config for 'bra'", () => {
    const config = getGaugeConfig("bra");
    expect(config.activeIndex).toBe(0);
    expect(config.label).toBe("Ser bra ut");
    expect(config.activeColor).toContain("status-ok");
  });

  it("returns correct config for 'godkänt'", () => {
    const config = getGaugeConfig("godkänt");
    expect(config.activeIndex).toBe(1);
    expect(config.label).toBe("Några saker att notera");
    expect(config.activeColor).toContain("severity-medium");
  });

  it("returns correct config for 'risk'", () => {
    const config = getGaugeConfig("risk");
    expect(config.activeIndex).toBe(2);
    expect(config.label).toBe("Värt att granska noga");
    expect(config.activeColor).toContain("severity-high");
  });
});
