import { describe, it, expect } from "vitest";
import { routes, routeReadingLinks } from "@/content/routes";
import { isConceptId } from "@/content/black-holes";
import { emptyLearning, parseLearning, makePlan } from "@/lib/learning";
import { matchQuestion } from "@/lib/questions";
describe("space learning contracts", () => {
  it("provides five connected routes with objectives, reasons and valid checkpoints", () => {
    expect(routes).toHaveLength(5);
    for (const r of routes) {
      expect(r.steps.length).toBeGreaterThan(3);
      expect(r.why).toHaveLength(r.steps.length);
      expect(r.objective).toBeTruthy();
      expect(r.checkpoint.options[r.checkpoint.correct]).toBeTruthy();
      for (const id of [...r.steps, r.checkpoint.revisit])
        expect(isConceptId(id)).toBe(true);
      for (let i = 1; i < r.steps.length; i++)
        expect(
          routeReadingLinks.some(
            ([a, b]) => a === r.steps[i - 1] && b === r.steps[i],
          ),
        ).toBe(true);
    }
  });
  it("adapts a bounded plan to time, preference and a misconception without dropping the remaining route", () => {
    const short = makePlan("time-relativity", 5, "foundations", []);
    expect(short.steps).toHaveLength(2);
    expect(short.remaining).toHaveLength(4);
    const overview = makePlan("stellar-lives", 15, "overview", []);
    expect(overview.steps).toEqual(["star", "white-dwarf", "black-hole"]);
    const repair = makePlan("black-holes", 10, "foundations", [
      { routeId: "black-holes", choice: 0, correct: false, at: 1 },
    ]);
    expect(repair.steps[0]).toBe("black-hole-shadow");
    expect(repair.reason).toContain("not a mastery score");
  });
  it("sanitizes learning records and recomputes answer validity", () => {
    expect(parseLearning("{")).toEqual(emptyLearning());
    expect(parseLearning("null")).toEqual(emptyLearning());
    const data = parseLearning(
      JSON.stringify({
        version: 1,
        notes: { star: "my thought", unknown: "x" },
        attempts: [
          { routeId: "stellar-lives", choice: 0, correct: true, at: 1 },
        ],
        plan: { routeId: "unknown", minutes: 5, focus: "overview" },
      }),
    );
    expect(data.notes).toEqual({ star: "my thought" });
    expect(data.attempts).toEqual([]);
    expect(data.plan).toBeNull();
  });
});
describe("question resolution fixtures", () => {
  it.each([
    ["Could the Sun become a black hole?", "matched", "stellar-lives"],
    ["Why are three bodies hard to predict?", "matched", "gravity-motion"],
    ["How far is a light-year?", "matched", "light-distance"],
    ["Why can clocks disagree?", "matched", "time-relativity"],
    ["What is an event horizon?", "matched", "black-holes"],
    ["What links clocks and black holes?", "clarify", "time-relativity"],
  ] as const)("%s → %s / %s", (q, status, route) => {
    const result = matchQuestion(q);
    expect(result.status).toBe(status);
    expect(result.routeIds).toContain(route);
    for (const id of result.conceptIds) expect(isConceptId(id)).toBe(true);
  });
  it.each([
    "Who wins the novel plot?",
    "Explain a sophon",
    "How do I cook pasta?",
    "GR",
    "",
  ])("abstains on unsupported or ambiguous question: %s", (q) => {
    expect(matchQuestion(q).status).toBe("unsupported");
  });
});
