"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Compass,
  ExternalLink,
  List,
  Network,
  Orbit,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConceptMap } from "@/components/concept-map";
import {
  byId,
  concepts,
  isConceptId,
  relationships,
  sources,
} from "@/content/black-holes";
import type { ConceptId, Evidence } from "@/content/schema";
import {
  emptyHistory,
  parseHistory,
  recordVisit,
  STORAGE_KEY,
  toggleSaved,
  type GuestHistory,
} from "@/lib/guest-history";
import { routes, routeForConcept, routeReadingLinks } from "@/content/routes";
import { LearningWorkspace } from "@/components/learning-workspace";
import { emptyLearning, parseLearning, LEARNING_KEY } from "@/lib/learning";
const initialViewport = { x: 34, y: 60, zoom: 0.72 };
function EvidenceLinks({ evidence }: { evidence: Evidence[] }) {
  return (
    <ul className="evidence-list">
      {evidence.map((e, index) => {
        const source = sources.find((s) => s.id === e.sourceId)!;
        return (
          <li key={`${e.sourceId}-${index}`}>
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.publisher}: {source.title}{" "}
              <ExternalLink size={13} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <small>
              {e.section} · Checked {source.checked}
            </small>
            <p>{e.support}</p>
          </li>
        );
      })}
    </ul>
  );
}
export function Explorer() {
  const [routeId, setRouteId] = useState("black-holes");
  const [learning, setLearning] = useState(emptyLearning);
  const route = routes.find((r) => r.id === routeId)!;
  const [active, setActive] = useState<ConceptId>("black-hole");
  const [backStack, setBackStack] = useState<
    { id: ConceptId; routeId: string; viewport: typeof initialViewport }[]
  >([]);
  const [history, setHistory] = useState<GuestHistory>(emptyHistory);
  const [ready, setReady] = useState(false);
  const [storageMessage, setStorageMessage] = useState("");
  const [view, setView] = useState<"graph" | "list">("graph");
  const [viewport, setViewport] = useState(initialViewport);
  const [resetVersion, setResetVersion] = useState(0);
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const shouldFocus = useRef(false);
  useEffect(() => {
    let restored = emptyHistory();
    try {
      restored = parseHistory(localStorage.getItem(STORAGE_KEY));
    } catch {
      setStorageMessage(
        "Browser storage is unavailable. Your exploration will last for this session.",
      );
    }
    const hash = decodeURIComponentSafe(window.location.hash.slice(1));
    const selected = isConceptId(hash)
      ? hash
      : (restored.visits.at(-1) ?? "black-hole");
    setActive(selected);
    setRouteId(routeForConcept(selected).id);
    try {
      setLearning(parseLearning(localStorage.getItem(LEARNING_KEY)));
    } catch {
      /* session-only */
    }
    setHistory(recordVisit(restored, selected));
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      localStorage.setItem(LEARNING_KEY, JSON.stringify(learning));
    } catch {
      setStorageMessage(
        "Browser storage is unavailable. Your exploration will last for this session.",
      );
    }
  }, [history, learning, ready]);
  useEffect(() => {
    if (shouldFocus.current) {
      heading.current?.focus({ preventScroll: true });
      if (window.matchMedia?.("(max-width: 900px)").matches)
        heading.current?.scrollIntoView({ block: "start" });
      shouldFocus.current = false;
    }
  }, [active]);
  const select = useCallback(
    (id: ConceptId) => {
      if (id !== active) {
        setBackStack((stack) =>
          [...stack, { id: active, routeId, viewport }].slice(-100),
        );
        shouldFocus.current = true;
        setActive(id);
      }
      setHistory((h) => recordVisit(h, id));
      window.history.replaceState(null, "", `#${id}`);
    },
    [active, routeId, viewport],
  );
  useEffect(() => {
    const onHash = () => {
      const id = decodeURIComponentSafe(window.location.hash.slice(1));
      if (isConceptId(id)) select(id);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [select]);
  const chooseRoute = (id: string) => {
    const target = routes.find((r) => r.id === id);
    if (!target) return;
    setRouteId(id);
    setQuery("");
    setSavedOnly(false);
    setResetVersion((v) => v + 1);
    select(target.steps[0]);
  };
  const goBack = () => {
    const previous = backStack.at(-1);
    if (!previous) return;
    const id = previous.id;
    setRouteId(previous.routeId);
    setViewport(previous.viewport);
    setBackStack(backStack.slice(0, -1));
    shouldFocus.current = true;
    setActive(id);
    setHistory((h) => recordVisit(h, id));
    window.history.replaceState(null, "", `#${id}`);
  };
  const concept = byId[active];
  const related = relationships.filter(
    (r) => r.from === active || r.to === active,
  );
  const nextIds = [
    ...new Set([
      ...related.map((r) => (r.from === active ? r.to : r.from)),
      ...routeReadingLinks
        .filter((pair) => pair.includes(active))
        .map(([a, b]) => (a === active ? b : a)),
    ]),
  ];
  const results = concepts.filter(
    (c) =>
      (!savedOnly || history.saved.includes(c.id)) &&
      [c.label, ...c.aliases].some((label) =>
        label.toLowerCase().includes(query.trim().toLowerCase()),
      ),
  );
  const clearHistory = () => {
    setHistory(emptyHistory());
    setLearning(emptyLearning());
    setBackStack([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEARNING_KEY);
    } catch {
      /* In-memory clear still works. */
    }
  };
  return (
    <>
      <a className="skip-link" href="#explanation">
        Skip to explanation
      </a>
      <header className="topbar">
        <a className="brand" href="#black-hole" aria-label="RabbitHole home">
          <Orbit aria-hidden="true" />
          RabbitHole<span className="brand-dot">.</span>
        </a>
        <div className="search">
          <Search size={17} aria-hidden="true" />
          <label className="sr-only" htmlFor="concept-search">
            Search reviewed concepts
          </label>
          <input
            id="concept-search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setView("list");
            }}
            placeholder="Find a concept…"
          />
        </div>
        <Button
          variant="ghost"
          aria-pressed={savedOnly}
          onClick={() => {
            setSavedOnly(!savedOnly);
            setView("list");
          }}
        >
          <Bookmark size={16} aria-hidden="true" />
          Saved ({history.saved.length})
        </Button>
        <span className="guest">Local guest</span>
      </header>
      <main className="workspace">
        <aside className="rail" aria-label="Routes and guest history">
          <div className="eyebrow">
            <Compass size={14} aria-hidden="true" /> CHOOSE A DIRECTION
          </div>
          <h2>
            Every question
            <br />
            opens a universe.
          </h2>
          <nav aria-label="Exploration routes">
            <div className="available-routes">
              {routes.map((r, i) => (
                <button
                  key={r.id}
                  className={
                    r.id === routeId ? "route-choice selected" : "route-choice"
                  }
                  aria-pressed={r.id === routeId}
                  onClick={() => chooseRoute(r.id)}
                >
                  <span className="route-number">
                    0{i + 1} · {r.minutes} MIN
                  </span>
                  <strong>{r.title}</strong>
                  <small>{r.question}</small>
                  <span>Explore route →</span>
                </button>
              ))}
            </div>
          </nav>
          <section className="history">
            <h3>Your recent trail</h3>
            <p className="muted">On this browser. Visited, not mastered.</p>
            {history.visits.length ? (
              <ol>
                {history.visits
                  .slice(-5)
                  .reverse()
                  .map((id) => (
                    <li key={id}>
                      <button onClick={() => select(id)}>
                        <span aria-hidden="true">↗</span> {byId[id].label}
                      </button>
                    </li>
                  ))}
              </ol>
            ) : (
              <p className="muted">Choose a concept to begin your trail.</p>
            )}
            <Button variant="ghost" size="sm" onClick={clearHistory}>
              Clear history & saved items
            </Button>
          </section>
          <p className="muted">
            Clear also removes your notes, sessions, and checkpoint attempts.
          </p>
          <p role="status" className="storage-message">
            {storageMessage}
          </p>
        </aside>
        <section className="exploration" aria-label="Concept exploration">
          <div className="intro">
            <div className="eyebrow">
              {route.title} <span>· {route.steps.length} STEPS</span>
            </div>
            <h1>Follow your curiosity.</h1>
            <p>Start with an idea. See what it connects to.</p>
          </div>
          <LearningWorkspace
            key={route.id}
            route={route}
            active={active}
            state={learning}
            update={setLearning}
            select={select}
            chooseRoute={chooseRoute}
          />
          <div className="map-toolbar">
            <Button
              variant="outline"
              size="sm"
              disabled={!backStack.length}
              onClick={goBack}
            >
              <ArrowLeft size={15} aria-hidden="true" /> Back
            </Button>
            <div className="view-switch" aria-label="Navigation view">
              <Button
                variant="ghost"
                size="sm"
                aria-pressed={view === "graph"}
                onClick={() => {
                  setView("graph");
                  setQuery("");
                  setSavedOnly(false);
                }}
              >
                <Network size={15} aria-hidden="true" />
                Graph
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
              >
                <List size={15} aria-hidden="true" />
                List
              </Button>
            </div>
          </div>
          <div className="graph-surface" hidden={view !== "graph"}>
            <ConceptMap
              active={active}
              visits={history.visits}
              saved={history.saved}
              select={select}
              viewport={viewport}
              setViewport={setViewport}
              resetVersion={resetVersion}
              visibleIds={[
                ...new Set([
                  ...route.steps,
                  active,
                  ...(routeId === "black-holes"
                    ? ([
                        "accretion-disk",
                        "black-hole-shadow",
                        "singularity",
                        "gravitational-waves",
                      ] as ConceptId[])
                    : []),
                ]),
              ]}
            />
            <div className="zoom-controls">
              <Button
                variant="outline"
                size="icon"
                aria-label="Zoom out"
                onClick={() =>
                  setViewport((v) => ({
                    ...v,
                    zoom: Math.max(0.35, v.zoom - 0.15),
                  }))
                }
              >
                <ZoomOut size={17} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Zoom in"
                onClick={() =>
                  setViewport((v) => ({
                    ...v,
                    zoom: Math.min(1.6, v.zoom + 0.15),
                  }))
                }
              >
                <ZoomIn size={17} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Reset map view"
                onClick={() => setResetVersion((v) => v + 1)}
              >
                <RotateCcw size={16} />
              </Button>
            </div>
          </div>
          {view === "list" && (
            <section
              className="concept-list"
              aria-label="Accessible concept list"
            >
              <h2>{savedOnly ? "Saved concepts" : "All space concepts"}</h2>
              {results.length === 0 && (
                <p>
                  No matching concepts. Try another search or turn off Saved.
                </p>
              )}
              {results.map((c) => (
                <button
                  key={c.id}
                  aria-pressed={active === c.id}
                  onClick={() => select(c.id)}
                >
                  <span>
                    <strong>{c.label}</strong>
                    <small>{c.question}</small>
                  </span>
                  <span>
                    {active === c.id
                      ? "Selected"
                      : history.visits.includes(c.id)
                        ? "✓ Visited"
                        : "Explore →"}
                    {history.saved.includes(c.id) ? " · ★" : ""}
                  </span>
                </button>
              ))}
            </section>
          )}
          <div className="map-caption">
            <span>
              <i className="solid-line" />
              Scientific relationship
            </span>
            <span>
              <i className="dashed-line" />
              Suggested reading
            </span>
            <p>
              Positions show connections between ideas, not locations in space.
            </p>
          </div>
          <nav className="route-steps" aria-label="Suggested reading sequence">
            <span className="eyebrow">A PATH TO TRY</span>
            <ol>
              {route.steps.map((id, i) => (
                <li key={id}>
                  <button
                    aria-current={id === active ? "step" : undefined}
                    onClick={() => select(id)}
                  >
                    <span>{i + 1}</span>
                    {byId[id].label}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </section>
        <article
          className="explanation"
          id="explanation"
          aria-labelledby="concept-heading"
        >
          <div className="panel-top">
            <Button
              variant="ghost"
              size="sm"
              disabled={!backStack.length}
              onClick={goBack}
              aria-label="Back to previous concept"
            >
              <ArrowLeft size={14} aria-hidden="true" />A closer look
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={
                history.saved.includes(active)
                  ? "Unsave concept"
                  : "Save concept"
              }
              aria-pressed={history.saved.includes(active)}
              onClick={() => setHistory((h) => toggleSaved(h, active))}
            >
              <Bookmark
                size={18}
                fill={history.saved.includes(active) ? "currentColor" : "none"}
              />
            </Button>
          </div>
          <div className="concept-art" aria-hidden="true">
            <div className="hole" />
            <span>AN IDEA WORTH EXPLORING</span>
          </div>
          <div className="panel-content" key={active}>
            <span className="status-badge">
              <Check size={12} aria-hidden="true" />
              Sources included
            </span>
            <h2 id="concept-heading" ref={heading} tabIndex={-1}>
              {concept.label}
            </h2>
            <p className="concept-question">{concept.question}</p>
            <p className="muted">
              {route.steps.includes(active)
                ? `Why this step: ${route.why[route.steps.indexOf(active)]}`
                : "A detour from your route. Use Back or the route steps to continue."}
            </p>
            <span className="epistemic">{concept.epistemic}</span>
            <p className="overview">{concept.overview}</p>
            <details>
              <summary>Go a little deeper</summary>
              <p>{concept.deeper}</p>
              <p className="muted">Scope: {concept.scope}</p>
            </details>
            <div className="misconception">
              <h3>A useful distinction</h3>
              <p>{concept.misconception}</p>
            </div>
            <section>
              <h3>Keep exploring</h3>
              <p className="muted">Suggested next reading</p>
              <div className="next-concepts">
                {nextIds.map((id) => (
                  <Button key={id} variant="outline" onClick={() => select(id)}>
                    {byId[id].label}
                    <ArrowRight size={14} aria-hidden="true" />
                  </Button>
                ))}
              </div>
            </section>
            <details>
              <summary>Scientific connections ({related.length})</summary>
              {related.length ? (
                related.map((r) => (
                  <section className="relationship" key={r.id}>
                    <h4>
                      {byId[r.from].label} → {byId[r.to].label}
                    </h4>
                    <span className="epistemic">
                      {r.type.replaceAll("_", " ")} · {r.epistemic}
                    </span>
                    <p>{r.claim}</p>
                    <EvidenceLinks evidence={r.evidence} />
                  </section>
                ))
              ) : (
                <p>
                  Connections shown as dashed lines are reading suggestions, not
                  scientific claims.
                </p>
              )}
            </details>
            <section className="sources">
              <h3>Sources & evidence</h3>
              <EvidenceLinks evidence={concept.evidence} />
            </section>
          </div>
        </article>
      </main>
      <footer>
        RabbitHole <span>Small steps into big ideas.</span>
        <span>No account or AI request needed.</span>
      </footer>
    </>
  );
}
function decodeURIComponentSafe(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return "";
  }
}
