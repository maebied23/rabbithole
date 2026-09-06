import { beforeEach, it, expect, vi } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Explorer } from "@/components/explorer";
import { routes } from "@/content/routes";
import { byId } from "@/content/black-holes";
import { LEARNING_KEY } from "@/lib/learning";
vi.mock("@/components/concept-map", () => ({
  ConceptMap: () => <div>Map adapter</div>,
}));
beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, "", "/");
});
it("opens every left route and its steps, and saves a checkpoint, session and note", async () => {
  const user = userEvent.setup();
  render(<Explorer />);
  const nav = screen.getByRole("navigation", { name: "Exploration routes" });
  for (const route of routes) {
    await user.click(
      within(nav).getByRole("button", { name: new RegExp(route.title) }),
    );
    expect(
      screen.getByRole("heading", { name: byId[route.steps[0]].label }),
    ).toBeInTheDocument();
    const steps = screen.getByRole("navigation", {
      name: "Suggested reading sequence",
    });
    expect(within(steps).getAllByRole("button")).toHaveLength(
      route.steps.length,
    );
  }
  await user.click(
    screen.getByText("Check your understanding", { selector: "summary" }),
  );
  await user.click(screen.getByRole("radio", { name: "A white dwarf" }));
  await user.click(screen.getByRole("button", { name: "Check answer" }));
  expect(screen.getByText("That distinction is right.")).toBeInTheDocument();
  await user.click(
    screen.getByText("Build my learning session", { selector: "summary" }),
  );
  await user.click(screen.getByRole("button", { name: "Build session" }));
  await user.click(
    screen.getByText("My explanation & open questions", {
      selector: "summary",
    }),
  );
  await user.type(
    screen.getByRole("textbox", { name: /Explain Star/ }),
    "Stars use fusion.",
  );
  const saved = JSON.parse(localStorage.getItem(LEARNING_KEY)!);
  expect(saved.attempts.at(-1).correct).toBe(true);
  expect(saved.plan.routeId).toBe("stellar-lives");
  expect(saved.notes.star).toBe("Stars use fusion.");
  await user.click(
    screen.getByRole("button", { name: "Clear history & saved items" }),
  );
  expect(JSON.parse(localStorage.getItem(LEARNING_KEY)!).notes).toEqual({});
});
it("answers the Sun question with authored reading and navigates to the proposed route", async () => {
  const user = userEvent.setup();
  render(<Explorer />);
  await user.click(
    screen.getByText("Ask a space question", { selector: "summary" }),
  );
  await user.type(
    screen.getByRole("textbox", { name: "What would you like to understand?" }),
    "Could the Sun become a black hole?",
  );
  await user.click(
    screen.getByRole("button", { name: "Find relevant reading" }),
  );
  expect(
    screen.getByText("Curated topic matching · no AI call"),
  ).toBeInTheDocument();
  await user.click(
    screen.getByRole("button", { name: "Explore How stars live and die" }),
  );
  expect(screen.getByRole("heading", { name: "Star" })).toBeInTheDocument();
});
it("updates the light-delay experiment with an explicit static model", async () => {
  const user = userEvent.setup();
  render(<Explorer />);
  await user.click(
    within(
      screen.getByRole("navigation", { name: "Exploration routes" }),
    ).getByRole("button", { name: /Light across enormous distances/ }),
  );
  await user.click(
    screen.getByText("Try it: distance and light delay", {
      selector: "summary",
    }),
  );
  expect(
    screen.getByText(/4 light-years → 4 years one way/),
  ).toBeInTheDocument();
  const slider = screen.getByRole("slider", {
    name: "Distance in light-years",
  });
  fireEvent.change(slider, { target: { value: "12" } });
  expect(
    screen.getByText(/12 light-years → 12 years one way; 24 years/),
  ).toBeInTheDocument();
  expect(screen.getByText(/Model: static distance/)).toBeInTheDocument();
});
