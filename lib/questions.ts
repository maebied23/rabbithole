import { byId, concepts } from "@/content/black-holes";
import { routes } from "@/content/routes";
import type { ConceptId } from "@/content/schema";
export interface QuestionMatch {
  status: "matched" | "clarify" | "unsupported";
  routeIds: string[];
  conceptIds: ConceptId[];
  answer: string;
  followUps: string[];
}
const intents = [
  {
    terms: /\b(sun|stars?|stellar|fusion|white dwarf)\b/i,
    route: "stellar-lives",
    ids: ["stellar-evolution", "white-dwarf"] as ConceptId[],
  },
  {
    terms:
      /\b(three[ -]bod(?:y|ies)|chaos|chaotic|orbits?|initial conditions|predict)\b/i,
    route: "gravity-motion",
    ids: ["three-body-problem", "deterministic-chaos"] as ConceptId[],
  },
  {
    terms: /\b(light[ -]?years?|distances?|light travel|far away|distant)\b/i,
    route: "light-distance",
    ids: ["light-year", "light-travel-time"] as ConceptId[],
  },
  {
    terms: /\b(clocks?|time dilation|relativity|time slows|time slow)\b/i,
    route: "time-relativity",
    ids: ["reference-frame", "gravitational-time-dilation"] as ConceptId[],
  },
  {
    terms: /\b(black holes?|horizons?|singularity|shadows?|light get out)\b/i,
    route: "black-holes",
    ids: ["black-hole", "event-horizon"] as ConceptId[],
  },
];
export function matchQuestion(question: string): QuestionMatch {
  const q = question.trim().slice(0, 600);
  if (
    !q ||
    /\b(plot|spoilers?|characters?|ending of the (book|novel)|trisolaran|sophon)\b/i.test(
      q,
    )
  )
    return {
      status: "unsupported",
      routeIds: [],
      conceptIds: [],
      answer:
        "This collection covers space and physics, without novel plots or fictional technologies. Try one of the suggested science questions.",
      followUps: routes.slice(0, 3).map((r) => r.question),
    };
  const exact = concepts.find((c) =>
    [c.label, ...c.aliases].some((a) => a.toLowerCase() === q.toLowerCase()),
  );
  const hits = intents.filter((i) => i.terms.test(q));
  if (exact) {
    const r = routes.find((r) => r.steps.includes(exact.id)) ?? routes[0];
    return {
      status: "matched",
      routeIds: [r.id],
      conceptIds: [exact.id],
      answer: exact.overview,
      followUps: [r.question, exact.question],
    };
  }
  if (!hits.length)
    return {
      status: "unsupported",
      routeIds: [],
      conceptIds: [],
      answer:
        "I can’t confidently map that question to this reviewed collection yet. Choose a nearby space question or name a concept more specifically.",
      followUps: routes.map((r) => r.question),
    };
  // A common cross-route question has an authored answer, not a keyword concatenation.
  if (/\bsun\b/i.test(q) && /black hole/i.test(q))
    return {
      status: "matched",
      routeIds: ["stellar-lives"],
      conceptIds: ["stellar-evolution", "white-dwarf", "black-hole"],
      answer: byId["stellar-evolution"].deeper,
      followUps: ["What makes a star shine?", "Why can’t light get out?"],
    };
  const ids = [...new Set(hits.flatMap((h) => h.ids))];
  return {
    status: hits.length > 1 ? "clarify" : "matched",
    routeIds: hits.map((h) => h.route),
    conceptIds: ids,
    answer:
      hits.length > 1
        ? "Your question touches more than one route. Choose the direction you want to explore first."
        : "Related reviewed reading is below. This is a local topic match, not a generated answer to every premise in your question.",
    followUps: hits.map((h) => routes.find((r) => r.id === h.route)!.question),
  };
}
