import { isConceptId } from "@/content/black-holes";
import { routes } from "@/content/routes";
import type { ConceptId } from "@/content/schema";
export const LEARNING_KEY = "rabbithole:learning:v1";
export interface Attempt {
  routeId: string;
  choice: number;
  correct: boolean;
  at: number;
}
export interface LearningState {
  version: 1;
  notes: Partial<Record<ConceptId, string>>;
  attempts: Attempt[];
  plan: {
    routeId: string;
    minutes: number;
    focus: "foundations" | "overview";
  } | null;
}
export const emptyLearning = (): LearningState => ({
  version: 1,
  notes: {},
  attempts: [],
  plan: null,
});
export function parseLearning(raw: string | null): LearningState {
  try {
    const d = JSON.parse(raw ?? "null");
    if (!d || d.version !== 1) return emptyLearning();
    const notes: LearningState["notes"] = {};
    if (d.notes && typeof d.notes === "object")
      for (const [id, note] of Object.entries(d.notes))
        if (isConceptId(id) && typeof note === "string")
          notes[id] = note.slice(0, 2000);
    const attempts: Attempt[] = Array.isArray(d.attempts)
      ? d.attempts
          .filter((a: Attempt) => {
            const r = routes.find((r) => r.id === a?.routeId);
            return (
              r &&
              Number.isInteger(a.choice) &&
              a.choice >= 0 &&
              a.choice < r.checkpoint.options.length &&
              typeof a.correct === "boolean" &&
              a.correct === (a.choice === r.checkpoint.correct) &&
              Number.isFinite(a.at) &&
              a.at >= 0
            );
          })
          .slice(-100)
      : [];
    const p = d.plan;
    const plan =
      p &&
      routes.some((r) => r.id === p.routeId) &&
      [5, 10, 15].includes(p.minutes) &&
      ["foundations", "overview"].includes(p.focus)
        ? { routeId: p.routeId, minutes: p.minutes, focus: p.focus }
        : null;
    return { version: 1, notes, attempts, plan };
  } catch {
    return emptyLearning();
  }
}
export function makePlan(
  routeId: string,
  minutes: number,
  focus: "foundations" | "overview",
  attempts: Attempt[],
) {
  const route = routes.find((r) => r.id === routeId) ?? routes[0];
  const latest = attempts.filter((a) => a.routeId === route.id).at(-1);
  const steps =
    focus === "foundations"
      ? [...route.steps]
      : route.steps.filter((_, i) => i === 0 || i >= route.steps.length - 2);
  if (latest && !latest.correct) {
    const existing = steps.indexOf(route.checkpoint.revisit);
    if (existing >= 0) steps.splice(existing, 1);
    steps.unshift(route.checkpoint.revisit);
  }
  const count = Math.max(2, Math.floor(minutes / 3));
  return {
    route,
    steps: steps.slice(0, count),
    remaining: steps.slice(count),
    reason:
      latest && !latest.correct
        ? "Your last checkpoint suggests revisiting a distinction. This is practice feedback, not a mastery score."
        : focus === "foundations"
          ? "Start with the foundations before the destination question."
          : "A short overview keeps the entrance and destination concepts.",
    estimatedMinutes: Math.min(steps.length, count) * 3,
  };
}
