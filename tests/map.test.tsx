import { afterEach, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConceptMap } from "@/components/concept-map";
import { concepts } from "@/content/black-holes";
afterEach(() => vi.unstubAllGlobals());
it("renders actual React Flow concept controls and activates them from the keyboard", async () => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  const select = vi.fn();
  render(
    <ConceptMap
      active="black-hole"
      visits={["black-hole"]}
      saved={["event-horizon"]}
      select={select}
      viewport={{ x: 0, y: 0, zoom: 1 }}
      setViewport={() => {}}
      resetVersion={0}
    />,
  );
  for (const concept of concepts)
    expect(
      screen.getByRole("button", { name: new RegExp(concept.label) }),
    ).toBeInTheDocument();
  const horizon = screen.getByRole("button", { name: /Event horizon/ });
  expect(horizon).toHaveTextContent("Saved");
  horizon.focus();
  await userEvent.keyboard("{Enter}");
  expect(select).toHaveBeenCalledWith("event-horizon");
  await userEvent.click(horizon);
  expect(select).toHaveBeenCalledTimes(2);
});
