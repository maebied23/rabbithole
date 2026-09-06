export const conceptIds = [
  "black-hole",
  "event-horizon",
  "spacetime",
  "general-relativity",
  "accretion-disk",
  "black-hole-shadow",
  "singularity",
  "gravitational-waves",
  "gravity",
  "orbit",
  "three-body-problem",
  "initial-conditions",
  "deterministic-chaos",
  "light-speed",
  "light-year",
  "light-travel-time",
  "reference-frame",
  "special-relativity",
  "kinematic-time-dilation",
  "gravitational-time-dilation",
  "star",
  "nuclear-fusion",
  "stellar-evolution",
  "white-dwarf",
] as const;
export type ConceptId = (typeof conceptIds)[number];
export type ConceptKind =
  | "object"
  | "boundary"
  | "framework"
  | "theory"
  | "structure"
  | "observation"
  | "model-limit"
  | "phenomenon";
export type EpistemicStatus =
  | "Established description"
  | "Supported observation"
  | "Model-dependent prediction";
export interface Evidence {
  sourceId: string;
  section: string;
  support: string;
}
export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  checked: string;
  revision: string;
  rights: string;
}
export interface Concept {
  id: ConceptId;
  label: string;
  aliases: string[];
  kind: ConceptKind;
  scope: string;
  version: number;
  editorial: "reviewed";
  epistemic: EpistemicStatus;
  question: string;
  overview: string;
  deeper: string;
  misconception: string;
  evidence: Evidence[];
  position: { x: number; y: number };
}
export type RelationType =
  | "has_boundary"
  | "predicts"
  | "describes"
  | "is_evidence_for";
export interface Relationship {
  id: string;
  from: ConceptId;
  to: ConceptId;
  type: RelationType;
  claim: string;
  epistemic: EpistemicStatus;
  evidence: Evidence[];
  editorial: "reviewed";
}
export interface EditorialRoute {
  id: string;
  title: string;
  steps: readonly ConceptId[];
  kind: "editorial-navigation";
}
