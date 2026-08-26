import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoadingScreen } from "./LoadingScreen";

vi.mock("./Strands", () => ({
  Strands: () => <div data-testid="strands-animation" />
}));

describe("LoadingScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));
  });

  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(document, "readyState", {
      configurable: true,
      value: "complete"
    });
  });

  it("waits for the page load event and the 2500ms minimum before exiting", () => {
    render(<LoadingScreen />);

    expect(screen.getByText("LOADING······")).toBeInTheDocument();
    expect(screen.getByTestId("strands-animation")).toBeInTheDocument();
    expect(screen.getByTestId("loading-orb")).toHaveClass("left-1/2", "top-1/2");
    expect(screen.getByTestId("loading-content")).toHaveClass("items-center", "justify-center");

    fireEvent(window, new Event("load"));
    act(() => vi.advanceTimersByTime(2499));
    expect(screen.getByTestId("loading-screen")).toHaveAttribute("data-state", "loading");

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByTestId("loading-screen")).toHaveAttribute("data-state", "exiting");

    act(() => vi.advanceTimersByTime(500));
    expect(screen.queryByTestId("loading-screen")).not.toBeInTheDocument();
  });

  it("measures the minimum display duration from first render", () => {
    Object.defineProperty(document, "readyState", {
      configurable: true,
      value: "loading"
    });

    render(<LoadingScreen />);

    act(() => vi.advanceTimersByTime(1000));
    fireEvent(window, new Event("load"));
    act(() => vi.advanceTimersByTime(1499));
    expect(screen.getByTestId("loading-screen")).toHaveAttribute("data-state", "loading");

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByTestId("loading-screen")).toHaveAttribute("data-state", "exiting");
  });

  it("uses a static fallback when the user requests reduced motion", () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true }));

    render(<LoadingScreen />);

    expect(screen.getByTestId("loading-screen")).toBeInTheDocument();
    expect(screen.queryByTestId("strands-animation")).not.toBeInTheDocument();
  });

  it("still renders when matchMedia is unavailable", () => {
    vi.stubGlobal("matchMedia", undefined);

    render(<LoadingScreen />);

    expect(screen.getByTestId("loading-screen")).toBeInTheDocument();
  });
});
