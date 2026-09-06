import { isConceptId } from "@/content/black-holes";
import type { ConceptId } from "@/content/schema";
export const STORAGE_KEY = "rabbithole:guest:v1";
export interface GuestHistory {
  version: 1;
  visits: ConceptId[];
  saved: ConceptId[];
}
export const emptyHistory = (): GuestHistory => ({
  version: 1,
  visits: [],
  saved: [],
});
export function parseHistory(raw: string | null): GuestHistory {
  try {
    const value: unknown = JSON.parse(raw ?? "null");
    if (
      !value ||
      typeof value !== "object" ||
      !("version" in value) ||
      value.version !== 1
    )
      return emptyHistory();
    const data = value as Record<string, unknown>;
    const ids = (v: unknown) =>
      Array.isArray(v) ? [...new Set(v.filter(isConceptId))].slice(-50) : [];
    return { version: 1, visits: ids(data.visits), saved: ids(data.saved) };
  } catch {
    return emptyHistory();
  }
}
export function recordVisit(
  history: GuestHistory,
  id: ConceptId,
): GuestHistory {
  return {
    ...history,
    visits: [...history.visits.filter((v) => v !== id), id].slice(-50),
  };
}
export function toggleSaved(
  history: GuestHistory,
  id: ConceptId,
): GuestHistory {
  return {
    ...history,
    saved: history.saved.includes(id)
      ? history.saved.filter((v) => v !== id)
      : [...history.saved, id],
  };
}
