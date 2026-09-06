"use client";
import { useState } from "react";
export function SpaceExperiment({ routeId }: { routeId: string }) {
  const [value, setValue] = useState(4);
  if (!["light-distance", "gravity-motion"].includes(routeId)) return null;
  const light = routeId === "light-distance";
  return (
    <details className="space-experiment">
      <summary>
        {light
          ? "Try it: distance and light delay"
          : "Try it: distance and gravitational pull"}
      </summary>
      <p>
        {light
          ? "Predict first: if the distance doubles, what happens to the waiting time for a signal?"
          : "Predict first: if the separation doubles, does gravity become half as strong?"}
      </p>
      <label>
        {light
          ? "Distance in light-years"
          : "Separation relative to the starting distance"}
        <input
          aria-label={light ? "Distance in light-years" : "Relative separation"}
          type="range"
          min={1}
          max={light ? 20 : 10}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </label>
      <output aria-live="polite">
        {light
          ? `${value} light-years → ${value} years one way; ${2 * value} years for an immediate reply.`
          : `${value}× separation → ${(100 / (value * value)).toFixed(1)}% of the original gravitational force.`}
      </output>
      <p className="muted">
        {light
          ? "Model: static distance, signal travels at c, instant reply. Cosmic expansion and relative motion are omitted."
          : "Model: Newtonian point masses with fixed masses. Only separation changes; this is not a three-body simulation."}
      </p>
      <details>
        <summary>Show the equation</summary>
        <p>
          {light
            ? "t = d / c. t is travel time, d is distance, and c is vacuum light speed. In light-years and years, c is one light-year per year."
            : "F / F₀ = 1 / k². F is the new force, F₀ is the starting force, and k is the separation multiplier. Masses are unchanged."}
        </p>
      </details>
    </details>
  );
}
