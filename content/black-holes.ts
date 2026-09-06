import { spaceConcepts, spaceSources, spaceRelationships } from "./space";
import type {
  Concept,
  ConceptId,
  EditorialRoute,
  Relationship,
  Source,
} from "./schema";
const rights =
  "Original paraphrases; link to source. No third-party images or article copies bundled.";
export const sources: Source[] = [
  ...spaceSources,
  {
    id: "nasa-anatomy",
    title: "Anatomy of a Black Hole",
    publisher: "NASA Science",
    url: "https://science.nasa.gov/universe/black-holes/anatomy/",
    checked: "2026-09-06",
    revision: "Page updated 2026-08-12",
    rights,
  },
  {
    id: "einstein-interior",
    title: "Changing places — space and time inside a black hole",
    publisher: "Einstein Online · Markus Pössel",
    url: "https://www.einstein-online.info/en/spotlight/changing_places/",
    checked: "2026-09-06",
    revision: "2010 · 03-1009",
    rights,
  },
  {
    id: "einstein-black-holes",
    title: "Black holes",
    publisher: "Einstein Online",
    url: "https://www.einstein-online.info/en/blackHoles/",
    checked: "2026-09-06",
    revision:
      "Undated educational article; historical observation forecast not reused",
    rights,
  },
  {
    id: "ligo-gw150914",
    title: "Observation of gravitational waves from a binary black hole merger",
    publisher: "LIGO Scientific Collaboration",
    url: "https://ligo.org/science-summaries/gw150914/",
    checked: "2026-09-06",
    revision: "GW150914 discovery summary",
    rights,
  },
  {
    id: "einstein-gr",
    title: "General relativity",
    publisher: "Einstein Online",
    url: "https://www.einstein-online.info/en/category/elementary/general-relativity-elementary/",
    checked: "2026-09-06",
    revision: "Elementary Einstein overview",
    rights,
  },
];
export const concepts: Concept[] = [
  ...spaceConcepts,
  {
    id: "black-hole",
    label: "Black hole",
    aliases: ["black holes"],
    kind: "object",
    scope: "Astrophysical black holes in classical general relativity.",
    version: 1,
    editorial: "reviewed",
    epistemic: "Supported observation",
    question: "Why can’t light get out?",
    overview:
      "A black hole is a region from which light cannot escape to the outside. Its boundary is called the event horizon. We learn about black holes through their effects on nearby matter and light.",
    deeper:
      "A hot disk of gas can make the surroundings conspicuous. An isolated black hole can be much harder to detect. Astronomers combine observations with physical models to infer what is there.",
    misconception:
      "The bright surroundings are not light escaping from inside the black hole.",
    evidence: [
      {
        sourceId: "einstein-black-holes",
        section: "Opening paragraphs and indirect signs",
        support:
          "Defines the horizon and describes gas emission and indirect detection.",
      },
    ],
    position: { x: 260, y: 210 },
  },
  {
    id: "event-horizon",
    label: "Event horizon",
    aliases: ["horizon"],
    kind: "boundary",
    scope:
      "Black-hole event horizon, not an apparent horizon or cosmological horizon.",
    version: 1,
    editorial: "reviewed",
    epistemic: "Established description",
    question: "What makes this boundary different?",
    overview:
      "The event horizon is a boundary in spacetime: signals sent from inside cannot reach the exterior. It is not a solid shell.",
    deeper:
      "In the idealized, eternal, nonrotating Schwarzschild black hole, every future-directed path inside leads inward. This is a statement about which journeys spacetime permits, not about an engine being too weak. Rotating and forming black holes have more complex interiors.",
    misconception:
      "“Space and time swap” is a coordinate-dependent analogy, not a literal rule for every black hole.",
    evidence: [
      {
        sourceId: "einstein-interior",
        section: "Black holes and The limits of the analogy",
        support:
          "Explains unavoidable inward motion and qualifies the eternal Schwarzschild model.",
      },
    ],
    position: { x: 540, y: 210 },
  },
  {
    id: "spacetime",
    label: "Spacetime",
    aliases: ["space-time"],
    kind: "framework",
    scope: "Space and time considered together in relativity.",
    version: 1,
    editorial: "reviewed",
    epistemic: "Established description",
    question: "How can a boundary change possible journeys?",
    overview:
      "To describe an event, we need both where it happens and when. Spacetime brings those pieces together. Its geometry helps determine the paths that light and freely falling objects can follow.",
    deeper:
      "Near a black hole, the geometry differs strongly from ordinary flat space. In the Schwarzschild model, inward motion beyond the horizon is unavoidable along future-directed paths.",
    misconception:
      "A drawing of a curved sheet is an aid to imagination; spacetime is not a physical fabric.",
    evidence: [
      {
        sourceId: "einstein-gr",
        section: "General relativity overview",
        support: "Introduces gravity as spacetime geometry.",
      },
      {
        sourceId: "einstein-interior",
        section: "The limits of the analogy",
        support: "Connects the horizon to the allowed inward paths.",
      },
    ],
    position: { x: 540, y: 400 },
  },
  {
    id: "general-relativity",
    label: "General relativity",
    aliases: ["Einstein’s theory of gravity"],
    kind: "theory",
    scope:
      "Einstein’s gravitational theory; distinct from special relativity. GR is context-dependent.",
    version: 1,
    editorial: "reviewed",
    epistemic: "Established description",
    question: "What connects gravity with geometry?",
    overview:
      "General relativity describes gravity through the geometry of spacetime. Matter and energy influence that geometry, and the geometry shapes how objects move.",
    deeper:
      "Black holes and gravitational waves are among its predictions. A successful theory still has limits: describing the deepest black-hole interior may require quantum physics.",
    misconception:
      "General relativity and special relativity are related, but they are not interchangeable names.",
    evidence: [
      {
        sourceId: "einstein-gr",
        section: "General relativity overview",
        support:
          "Describes geometric gravity and the relationship to special relativity.",
      },
      {
        sourceId: "nasa-anatomy",
        section: "Singularity",
        support: "Identifies possible limits of relativity at singularities.",
      },
    ],
    position: { x: 260, y: 400 },
  },
  {
    id: "accretion-disk",
    label: "Accretion disk",
    aliases: ["accretion disc"],
    kind: "structure",
    scope: "Gas disks around black holes; disks also occur elsewhere.",
    version: 1,
    editorial: "reviewed",
    epistemic: "Supported observation",
    question: "Where does the glow come from?",
    overview:
      "Hot gas orbiting outside a black hole can form a bright accretion disk.",
    deeper:
      "Gas gradually moves inward. Some black holes lack a disk because little surrounding matter is available.",
    misconception:
      "The disk lies outside the horizon; it is not the black hole’s surface.",
    evidence: [
      {
        sourceId: "nasa-anatomy",
        section: "Accretion Disk",
        support: "Describes a hot disk and isolated black holes without one.",
      },
    ],
    position: { x: 0, y: 50 },
  },
  {
    id: "black-hole-shadow",
    label: "Black-hole shadow",
    aliases: ["event horizon shadow"],
    kind: "observation",
    scope: "Dark image feature produced by light capture and deflection.",
    version: 1,
    editorial: "reviewed",
    epistemic: "Supported observation",
    question: "What is the dark patch in an image?",
    overview:
      "Light capture and gravitational bending create a dark region called the shadow.",
    deeper:
      "The shadow appears larger than the event horizon. Its appearance depends on light traveling through the surrounding spacetime.",
    misconception:
      "A shadow is not a photograph of a solid surface or the singularity.",
    evidence: [
      {
        sourceId: "nasa-anatomy",
        section: "Event Horizon Shadow",
        support:
          "Separates the shadow from the horizon and explains capture and lensing.",
      },
    ],
    position: { x: 260, y: 0 },
  },
  {
    id: "singularity",
    label: "Singularity",
    aliases: ["black-hole singularity"],
    kind: "model-limit",
    scope:
      "A limit of the classical black-hole description, not an observed physical point.",
    version: 1,
    editorial: "reviewed",
    epistemic: "Model-dependent prediction",
    question: "Where does our description stop?",
    overview:
      "Classical black-hole models predict a singularity, where the description breaks down.",
    deeper:
      "Whether this represents a physical structure is unknown. Quantum effects may require a more complete theory of gravity.",
    misconception: "No black-hole image directly shows a singularity.",
    evidence: [
      {
        sourceId: "nasa-anatomy",
        section: "Singularity",
        support:
          "States the prediction, uncertainty, and possible need for quantum effects.",
      },
    ],
    position: { x: 0, y: 400 },
  },
  {
    id: "gravitational-waves",
    label: "Gravitational waves",
    aliases: ["gravitational radiation"],
    kind: "phenomenon",
    scope: "Spacetime waves; GW150914 is an example measurement, not an alias.",
    version: 1,
    editorial: "reviewed",
    epistemic: "Supported observation",
    question: "Can we detect a collision without seeing light?",
    overview:
      "Gravitational waves are traveling disturbances in spacetime. LIGO detected the GW150914 signal in 2015; its pattern matched a pair of black holes spiraling together and merging.",
    deeper:
      "Two widely separated detectors measured the signal. Scientists compared it with waveforms calculated using general relativity. The agreement supports the merger interpretation; it is not a view inside either horizon.",
    misconception: "These are not sound waves traveling through air.",
    evidence: [
      {
        sourceId: "ligo-gw150914",
        section:
          "Introduction and Background; Our LIGO observations and what they mean",
        support:
          "Describes waves, the two detections, and comparison with merger waveforms.",
      },
    ],
    position: { x: 0, y: 210 },
  },
];
export const byId = Object.fromEntries(
  concepts.map((c) => [c.id, c]),
) as Record<ConceptId, Concept>;
export const blackHoleRoute: EditorialRoute = {
  id: "black-holes",
  title: "Inside the idea of a black hole",
  kind: "editorial-navigation",
  steps: ["black-hole", "event-horizon", "spacetime", "general-relativity"],
};
export const relationships: Relationship[] = [
  ...spaceRelationships,
  {
    id: "black-hole-has-boundary",
    from: "black-hole",
    to: "event-horizon",
    type: "has_boundary",
    claim: "A black hole has an event horizon as its boundary.",
    editorial: "reviewed",
    epistemic: "Established description",
    evidence: [
      {
        sourceId: "einstein-black-holes",
        section: "Opening definition",
        support: "Names the black-hole boundary as the horizon.",
      },
    ],
  },
  {
    id: "gr-describes-spacetime",
    from: "general-relativity",
    to: "spacetime",
    type: "describes",
    claim: "General relativity describes gravity through spacetime geometry.",
    editorial: "reviewed",
    epistemic: "Established description",
    evidence: [
      {
        sourceId: "einstein-gr",
        section: "Overview",
        support: "Geometric description of gravity.",
      },
    ],
  },
  {
    id: "gr-predicts-waves",
    from: "general-relativity",
    to: "gravitational-waves",
    type: "predicts",
    claim: "General relativity predicts gravitational waves.",
    editorial: "reviewed",
    epistemic: "Established description",
    evidence: [
      {
        sourceId: "ligo-gw150914",
        section: "Introduction and Background",
        support: "Attributes the prediction to Einstein in 1916.",
      },
    ],
  },
  {
    id: "waves-evidence-black-holes",
    from: "gravitational-waves",
    to: "black-hole",
    type: "is_evidence_for",
    claim:
      "The GW150914 wave signal supports a binary black-hole merger interpretation.",
    editorial: "reviewed",
    epistemic: "Supported observation",
    evidence: [
      {
        sourceId: "ligo-gw150914",
        section: "Our LIGO observations and what they mean",
        support:
          "Measured signal agrees with calculated binary merger waveforms.",
      },
    ],
  },
];
// These connections are reading suggestions, never causal scientific assertions.
export const readingLinks: readonly [ConceptId, ConceptId][] = [
  ["black-hole", "accretion-disk"],
  ["black-hole", "black-hole-shadow"],
  ["event-horizon", "spacetime"],
  ["general-relativity", "singularity"],
];
export function isConceptId(value: unknown): value is ConceptId {
  return typeof value === "string" && Object.hasOwn(byId, value);
}
