import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  render,
  screen,
  within,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Explorer } from "@/components/explorer";
import { STORAGE_KEY } from "@/lib/guest-history";
// DOM tests exercise the complete explorer via a map adapter. Canvas layout requires browser testing.
vi.mock("@/components/concept-map", () => ({
  ConceptMap: ({
    select,
    viewport,
  }: {
    select: (id: string) => void;
    viewport: { zoom: number };
  }) => (
    <div data-testid="map" data-zoom={viewport.zoom}>
      <button onClick={() => select("event-horizon")}>
        Map: Event horizon
      </button>
    </div>
  ),
}));
beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, "", "/");
});
describe("first exploration", () => {
  it("completes map → horizon → spacetime → source → back without losing zoom", async () => {
    const user = userEvent.setup();
    render(<Explorer />);
    await user.click(screen.getByRole("button", { name: "Zoom in" }));
    const zoom = screen.getByTestId("map").getAttribute("data-zoom");
    await user.click(
      screen.getByRole("button", { name: "Map: Event horizon" }),
    );
    expect(
      screen.getByRole("heading", { name: "Event horizon" }),
    ).toHaveFocus();
    const article = screen.getByRole("article");
    await user.click(
      within(article).getByRole("button", { name: "Spacetime" }),
    );
    expect(
      screen.getByRole("heading", { name: "Spacetime" }),
    ).toBeInTheDocument();
    expect(within(article).getAllByRole("link")[0]).toHaveAttribute(
      "href",
      expect.stringContaining("einstein-online.info"),
    );
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(
      screen.getByRole("heading", { name: "Event horizon" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("map")).toHaveAttribute("data-zoom", zoom!);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).visits).toContain(
      "spacetime",
    );
  });
  it("supports list, keyboard selection, search, bookmarks, reload and clear", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Explorer />);
    await user.click(screen.getByRole("button", { name: "List" }));
    const list = screen.getByRole("region", {
      name: "Accessible concept list",
    });
    const target = within(list).getByRole("button", {
      name: /Black-hole shadow/,
    });
    target.focus();
    await user.keyboard("{Enter}");
    expect(
      screen.getByRole("heading", { name: "Black-hole shadow" }),
    ).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Save concept" }));
    await user.type(
      screen.getByRole("textbox", { name: "Search reviewed concepts" }),
      "nothing-matches",
    );
    expect(screen.getByText(/No matching concepts/)).toBeInTheDocument();
    unmount();
    render(<Explorer />);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Black-hole shadow" }),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByRole("button", { name: "Unsave concept" }),
    ).toHaveAttribute("aria-pressed", "true");
    await user.click(
      screen.getByRole("button", { name: "Clear history & saved items" }),
    );
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual({
      version: 1,
      visits: [],
      saved: [],
    });
  });
  it("recovers from broken storage and accepts only canonical deep links", async () => {
    localStorage.setItem(STORAGE_KEY, "{bad json");
    window.history.replaceState(null, "", "/#event-horizon");
    render(<Explorer />);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Event horizon" }),
      ).toBeInTheDocument(),
    );
    window.history.replaceState(null, "", "/#__proto__");
    fireEvent(window, new HashChangeEvent("hashchange"));
    expect(
      screen.getByRole("heading", { name: "Event horizon" }),
    ).toBeInTheDocument();
  });
  it("continues when local storage throws", async () => {
    const spy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("quota");
      });
    render(<Explorer />);
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "storage is unavailable",
      ),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Map: Event horizon" }),
    );
    expect(
      screen.getByRole("heading", { name: "Event horizon" }),
    ).toBeInTheDocument();
    spy.mockRestore();
  });
});
