"use client";
import { SpaceExperiment } from "@/components/space-experiment";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { byId, sources } from "@/content/black-holes";
import { routes, type LearningRoute } from "@/content/routes";
import type { ConceptId } from "@/content/schema";
import { makePlan, type LearningState } from "@/lib/learning";
import { matchQuestion, type QuestionMatch } from "@/lib/questions";
export function LearningWorkspace({
  route,
  active,
  state,
  update,
  select,
  chooseRoute,
}: {
  route: LearningRoute;
  active: ConceptId;
  state: LearningState;
  update: (s: LearningState) => void;
  select: (id: ConceptId) => void;
  chooseRoute: (id: string) => void;
}) {
  const [question, setQuestion] = useState("");
  const [match, setMatch] = useState<QuestionMatch | null>(null);
  const [minutes, setMinutes] = useState(10);
  const [focus, setFocus] = useState<"foundations" | "overview">("foundations");
  const [choice, setChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState(false);
  const [ai, setAi] = useState<{
    answer: string;
    conceptIds: ConceptId[];
    sourceIds: string[];
  } | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const plan = state.plan
    ? makePlan(
        state.plan.routeId,
        state.plan.minutes,
        state.plan.focus,
        state.attempts,
      )
    : null;
  const latest = state.attempts.filter((a) => a.routeId === route.id).at(-1);
  function ask(q: string) {
    if (busy) return;
    setQuestion(q);
    setMatch(matchQuestion(q));
    setAi(null);
    setMessage("");
  }
  async function askAI() {
    setBusy(true);
    setMessage("");
    setAi(null);
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, conceptId: active }),
        signal: AbortSignal.timeout(25000),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error ?? "AI is unavailable. Curated reading still works.",
        );
      setAi(data);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "AI is unavailable.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="learning-workspace" aria-label="Learning studio">
      <div className="eyebrow">LEARNING STUDIO</div>
      <h2>{route.question}</h2>
      <p>{route.objective}</p>
      <SpaceExperiment key={route.id} routeId={route.id} />
      <details>
        <summary>Ask a space question</summary>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
        >
          <label htmlFor="space-question">
            What would you like to understand?
          </label>
          <textarea
            id="space-question"
            disabled={busy}
            maxLength={600}
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              setAi(null);
              setMatch(null);
            }}
            placeholder="Could the Sun become a black hole?"
          />
          <Button type="submit" disabled={!question.trim() || busy}>
            Find relevant reading
          </Button>
        </form>
        <div className="question-chips">
          {[
            route.question,
            "Could the Sun become a black hole?",
            "Why are three bodies hard to predict?",
          ]
            .filter((q, i, a) => a.indexOf(q) === i)
            .map((q) => (
              <Button
                key={q}
                variant="ghost"
                size="sm"
                disabled={busy}
                onClick={() => ask(q)}
              >
                {q}
              </Button>
            ))}
        </div>
        {match && (
          <div className="question-result">
            <span className="status-badge">
              Curated topic matching · no AI call
            </span>
            <p>{match.answer}</p>
            {match.conceptIds.map((id) => (
              <div key={id}>
                <Button variant="ghost" onClick={() => select(id)}>
                  {byId[id].label} →
                </Button>
                <p>{byId[id].overview}</p>
              </div>
            ))}
            {match.routeIds.map((id) => (
              <Button
                key={id}
                variant="outline"
                onClick={() => chooseRoute(id)}
              >
                Explore {routes.find((r) => r.id === id)!.title}
              </Button>
            ))}
            <p className="muted">Follow a related question</p>
            {match.followUps
              .filter((q) => q !== question)
              .map((q) => (
                <Button
                  key={q}
                  variant="ghost"
                  size="sm"
                  onClick={() => ask(q)}
                >
                  {q}
                </Button>
              ))}
          </div>
        )}
        <details>
          <summary>Explore your question</summary>
          <p className="muted">
            Sends this question and selected concept to OpenAI when configured.
            Your notebook and learning history stay on this browser. Generated
            answers may be wrong; compare the sources.
          </p>
          <Button
            disabled={!question.trim() || busy}
            variant="outline"
            onClick={askAI}
          >
            {busy ? "Thinking…" : "Get an explanation"}
          </Button>
          {message && <p role="status">{message}</p>}
          {ai && (
            <div className="question-result">
              <span className="status-badge">AI-assisted explanation</span>
              <p>{ai.answer}</p>
              {ai.conceptIds.map((id) => (
                <Button variant="ghost" key={id} onClick={() => select(id)}>
                  {byId[id].label} →
                </Button>
              ))}
              <h4>Sources supplied to the model</h4>
              {ai.sourceIds.map((id) => {
                const s = sources.find((s) => s.id === id)!;
                return (
                  <p key={id}>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.publisher}: {s.title} ↗
                    </a>
                  </p>
                );
              })}
            </div>
          )}
        </details>
      </details>
      <details>
        <summary>Build my learning session</summary>
        <div className="plan-controls">
          <label>
            Time available
            <select
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
            >
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
            </select>
          </label>
          <label>
            Starting point
            <select
              value={focus}
              onChange={(e) => setFocus(e.target.value as typeof focus)}
            >
              <option value="foundations">Start with foundations</option>
              <option value="overview">Give me an overview</option>
            </select>
          </label>
          <Button
            onClick={() =>
              update({ ...state, plan: { routeId: route.id, minutes, focus } })
            }
          >
            Build session
          </Button>
        </div>
        {plan && (
          <div className="question-result">
            <h3>{plan.route.title}</h3>
            <p>{plan.reason}</p>
            <p className="muted">
              About {plan.estimatedMinutes} minutes of reading, plus practice.
              Go at your own pace.
            </p>
            <ol>
              {plan.steps.map((id) => (
                <li key={id}>
                  <Button variant="ghost" onClick={() => select(id)}>
                    {byId[id].label}
                  </Button>
                  <small>
                    {plan.route.why[plan.route.steps.indexOf(id)] ??
                      "Revisit the distinction from your checkpoint."}
                  </small>
                </li>
              ))}
            </ol>
            {plan.remaining.length > 0 && (
              <p className="muted">
                Continue later:{" "}
                {plan.remaining.map((id) => byId[id].label).join(" → ")}
              </p>
            )}
            <Button
              variant="ghost"
              onClick={() => update({ ...state, plan: null })}
            >
              Remove session
            </Button>
          </div>
        )}
      </details>
      <details>
        <summary>Check your understanding</summary>
        <fieldset>
          <legend>{route.checkpoint.question}</legend>
          {route.checkpoint.options.map((o, i) => (
            <label className="answer-option" key={o}>
              <input
                type="radio"
                name={`checkpoint-${route.id}`}
                checked={choice === i}
                onChange={() => {
                  setChoice(i);
                  setFeedback(false);
                }}
              />
              {o}
            </label>
          ))}
        </fieldset>
        <Button
          disabled={choice === null || feedback}
          onClick={() => {
            if (choice === null) return;
            update({
              ...state,
              attempts: [
                ...state.attempts,
                {
                  routeId: route.id,
                  choice,
                  correct: choice === route.checkpoint.correct,
                  at: Date.now(),
                },
              ].slice(-100),
            });
            setFeedback(true);
          }}
        >
          Check answer
        </Button>
        {feedback && (
          <div role="status" className="question-result">
            <strong>
              {choice === route.checkpoint.correct
                ? "That distinction is right."
                : "Let’s revisit the distinction."}
            </strong>
            <p>{route.checkpoint.feedback}</p>
            <Button
              variant="outline"
              onClick={() => select(route.checkpoint.revisit)}
            >
              Revisit {byId[route.checkpoint.revisit].label}
            </Button>
          </div>
        )}
        {latest && (
          <p className="muted">
            Last attempt:{" "}
            {latest.correct ? "answered correctly" : "worth another look"}. One
            answer is not a mastery assessment.
          </p>
        )}
      </details>
      <details>
        <summary>My explanation & open questions</summary>
        <label htmlFor="concept-note">
          Explain {byId[active].label} in your own words. What is still unclear?
        </label>
        <textarea
          id="concept-note"
          maxLength={2000}
          value={state.notes[active] ?? ""}
          onChange={(e) =>
            update({
              ...state,
              notes: { ...state.notes, [active]: e.target.value },
            })
          }
        />
        <p className="muted">
          Saved locally as you type. Private to this browser profile.
        </p>
        {Object.entries(state.notes)
          .filter(([, note]) => note?.trim())
          .map(([id]) => (
            <Button
              variant="ghost"
              size="sm"
              key={id}
              onClick={() => select(id as ConceptId)}
            >
              Notes: {byId[id as ConceptId].label}
            </Button>
          ))}
      </details>
    </section>
  );
}
