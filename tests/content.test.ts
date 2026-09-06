import { describe, expect, it } from "vitest";
import {
  blackHoleRoute,
  byId,
  concepts,
  readingLinks,
  relationships,
  sources,
  isConceptId,
} from "@/content/black-holes";
import {
  emptyHistory,
  parseHistory,
  recordVisit,
  toggleSaved,
} from "@/lib/guest-history";
describe("reviewed seed contracts", () => {
  it("has unique canonical identities, complete evidence, and source revisions", () => {
    expect(new Set(concepts.map((c) => c.id)).size).toBe(concepts.length);
    expect(new Set(sources.map((s) => s.id)).size).toBe(sources.length);
    for (const item of [...concepts, ...relationships]) {
      expect(item.editorial).toBe("reviewed");
      expect(item.evidence.length).toBeGreaterThan(0);
      for (const evidence of item.evidence) {
        const source = sources.find((s) => s.id === evidence.sourceId);
        expect(source).toBeDefined();
        expect(source!.url).toMatch(/^https:\/\//);
        expect(source!.revision).toBeTruthy();
        expect(evidence.section).toBeTruthy();
        expect(evidence.support).toBeTruthy();
      }
    }
  });
  it("constrains relationship endpoints and keeps reading paths separate", () => {
    const allowed = {
      has_boundary: ["object:boundary"],
      predicts: ["theory:phenomenon"],
      describes: ["theory:framework"],
      is_evidence_for: ["phenomenon:object"],
    };
    for (const edge of relationships) {
      expect(allowed[edge.type]).toContain(
        `${byId[edge.from].kind}:${byId[edge.to].kind}`,
      );
      expect(edge.from).not.toBe(edge.to);
    }
    expect(blackHoleRoute.kind).toBe("editorial-navigation");
    for (const id of [...blackHoleRoute.steps, ...readingLinks.flat()])
      expect(isConceptId(id)).toBe(true);
    expect(blackHoleRoute.steps).toEqual([
      "black-hole",
      "event-horizon",
      "spacetime",
      "general-relativity",
    ]);
  });
  it("preserves important scientific distinctions", () => {
    expect(byId["event-horizon"].kind).not.toBe(byId["black-hole-shadow"].kind);
    expect(byId.singularity.epistemic).toBe("Model-dependent prediction");
    expect(byId.singularity.deeper).toMatch(/unknown/);
    expect(byId["event-horizon"].deeper).toMatch(/Schwarzschild/);
    expect(byId["general-relativity"].aliases).not.toContain("GR");
    expect(isConceptId("__proto__")).toBe(false);
  });
});
describe("private guest history", () => {
  it("recovers from invalid storage and filters unknown IDs", () => {
    for (const raw of [null, "{", "null", "5", '{"version":2}'])
      expect(parseHistory(raw)).toEqual(emptyHistory());
    expect(
      parseHistory(
        JSON.stringify({
          version: 1,
          visits: ["event-horizon", "nope", "event-horizon", "__proto__", 5],
          saved: "bad",
        }),
      ),
    ).toEqual({ version: 1, visits: ["event-horizon"], saved: [] });
  });
  it("records recency without claiming mastery and toggles bookmarks independently", () => {
    const h = recordVisit(
      recordVisit(recordVisit(emptyHistory(), "black-hole"), "spacetime"),
      "black-hole",
    );
    expect(h.visits).toEqual(["spacetime", "black-hole"]);
    const saved = toggleSaved(h, "event-horizon");
    expect(saved.saved).toEqual(["event-horizon"]);
    expect(saved.visits).toEqual(h.visits);
    expect(toggleSaved(saved, "event-horizon").saved).toEqual([]);
  });
});
