import { describe, expect, it } from "vitest";
import { exportTokens, parseDTCG, resolveTokens } from "@/lib/ds/engine";

const doc = { color: { $type: "color", base: { $value: "#3b82f6" }, brand: { $value: "{color.base}" }, a: { $value: "{color.b}" }, b: { $value: "{color.a}" } } };

describe("token engine", () => {
  const r = resolveTokens(parseDTCG(doc));
  it("resolves alias chains", () => expect(r.find((t) => t.path === "color.brand")?.resolved).toBe("#3b82f6"));
  it("detects cycles", () => expect(r.find((t) => t.path === "color.a")?.error).toMatch(/Circular/));
  it("exports CSS aliases as var()", () => expect(exportTokens(parseDTCG(doc), "css")).toContain("--color-brand: var(--color-base);"));
});
