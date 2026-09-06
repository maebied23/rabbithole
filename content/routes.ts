import type { ConceptId, EditorialRoute } from "./schema";
import { blackHoleRoute, readingLinks } from "./black-holes";
export interface LearningRoute extends EditorialRoute {
  question: string;
  objective: string;
  minutes: number;
  why: string[];
  checkpoint: {
    question: string;
    options: string[];
    correct: number;
    feedback: string;
    revisit: ConceptId;
  };
}
export const routes: LearningRoute[] = [
  {
    ...blackHoleRoute,
    question: "Why can’t light get out?",
    objective:
      "Distinguish the horizon, shadow, and limits of a black-hole model.",
    minutes: 12,
    why: [
      "Begin with the object we infer from observations.",
      "Identify its boundary.",
      "Understand why geometry limits possible journeys.",
      "Meet the theory behind the model.",
    ],
    checkpoint: {
      question: "The dark patch in a black-hole image is…",
      options: [
        "A solid surface",
        "A shadow shaped by light capture and bending",
        "A direct image of the singularity",
      ],
      correct: 1,
      feedback:
        "The shadow is distinct from the event horizon. An image does not reveal a singularity.",
      revisit: "black-hole-shadow",
    },
  },
  {
    id: "gravity-motion",
    kind: "editorial-navigation",
    title: "Three bodies, unpredictable paths",
    question: "Why are three bodies hard to predict?",
    objective:
      "Explain sensitivity to starting conditions without confusing it with randomness.",
    minutes: 15,
    steps: [
      "gravity",
      "orbit",
      "initial-conditions",
      "three-body-problem",
      "deterministic-chaos",
    ],
    why: [
      "Establish the gravitational interaction.",
      "See how gravity shapes motion.",
      "Identify the inputs to a prediction.",
      "Add a third interacting body.",
      "Separate deterministic rules from predictable outcomes.",
    ],
    checkpoint: {
      question:
        "Two nearly identical three-body starting states diverge. What can this show?",
      options: [
        "The force changes randomly",
        "Every three-body system is unstable",
        "Sensitivity to initial conditions",
      ],
      correct: 2,
      feedback:
        "Deterministic equations can amplify small initial differences. Special regular three-body solutions also exist.",
      revisit: "deterministic-chaos",
    },
  },
  {
    id: "light-distance",
    kind: "editorial-navigation",
    title: "Light across enormous distances",
    question: "Are we seeing distant stars as they are now?",
    objective: "Use light travel time and distinguish distance from duration.",
    minutes: 10,
    steps: ["light-speed", "light-year", "light-travel-time", "star"],
    why: [
      "Establish the signal speed.",
      "Define the distance unit.",
      "Connect distance to observation delay.",
      "Apply the idea to a familiar light source.",
    ],
    checkpoint: {
      question:
        "In a static setting, light from a star 12 light-years away takes…",
      options: [
        "12 years to reach us",
        "12 seconds to reach us",
        "No time because light is fast",
      ],
      correct: 0,
      feedback:
        "A light-year is the distance light travels in a year. At 12 light-years, the one-way light delay is 12 years in this model.",
      revisit: "light-travel-time",
    },
  },
  {
    id: "time-relativity",
    kind: "editorial-navigation",
    title: "When clocks disagree",
    question: "Why can two clocks record different durations?",
    objective:
      "Specify the comparison frame and separate motion from gravitational effects.",
    minutes: 15,
    steps: [
      "reference-frame",
      "special-relativity",
      "kinematic-time-dilation",
      "spacetime",
      "general-relativity",
      "gravitational-time-dilation",
    ],
    why: [
      "Say who measures the time.",
      "Learn how inertial observers relate measurements.",
      "Consider relative motion.",
      "Combine where and when.",
      "Bring gravity into the description.",
      "Compare clocks at different gravitational potentials.",
    ],
    checkpoint: {
      question:
        "A traveler carries an ideal clock. What do they experience locally?",
      options: [
        "Their own seconds feel slower",
        "Their own clock runs normally",
        "Their clock stops at high speed",
      ],
      correct: 1,
      feedback:
        "Time dilation concerns comparisons. A traveler experiences their own clock normally; motion and gravity matter when comparing different clocks.",
      revisit: "reference-frame",
    },
  },
  {
    id: "stellar-lives",
    kind: "editorial-navigation",
    title: "How stars live and die",
    question: "Could the Sun become a black hole?",
    objective:
      "Connect stellar energy and evolution while distinguishing possible remnants.",
    minutes: 12,
    steps: [
      "star",
      "nuclear-fusion",
      "stellar-evolution",
      "white-dwarf",
      "black-hole",
    ],
    why: [
      "Start with what a star is.",
      "Identify its main-sequence energy source.",
      "Follow changes in fuel and structure.",
      "Understand the Sun’s expected remnant.",
      "Contrast a different stellar outcome, not the next stage of a white dwarf.",
    ],
    checkpoint: {
      question: "The Sun is expected to leave behind…",
      options: ["A black hole", "A neutron star", "A white dwarf"],
      correct: 2,
      feedback:
        "The Sun’s expected remnant is a white dwarf. Stellar outcomes depend on mass and evolution; these are branches, not one universal sequence.",
      revisit: "stellar-evolution",
    },
  },
];
export function routeForConcept(id: ConceptId) {
  return routes.find((r) => r.steps.includes(id)) ?? routes[0];
}
export const routeReadingLinks: readonly [ConceptId, ConceptId][] = [
  ...readingLinks,
  ...routes.flatMap((r) =>
    r.steps.slice(1).map((id, i): [ConceptId, ConceptId] => [r.steps[i], id]),
  ),
];
