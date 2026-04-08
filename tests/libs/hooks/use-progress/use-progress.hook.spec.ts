/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useProgress } from "~/libs/hooks/use-progress/use-progress.hook";

// ─── Constants (mirrored from the hook for readability) ───────────────────────

const PROGRESS_START = 0;
const PROGRESS_END = 100;
const PROGRESS_STEP = 1;
const TICK_INTERVAL_MS = 30;

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useProgress", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("uncontrolled mode (no value)", () => {
        it("should start with progress 0", () => {
            const { result } = renderHook(() => useProgress());

            expect(result.current.progress).toBe(PROGRESS_START);
        });

        it("should increment progress by 1 every 30ms", () => {
            const { result } = renderHook(() => useProgress());

            act(() => {
                vi.advanceTimersByTime(TICK_INTERVAL_MS * 10);
            });

            expect(result.current.progress).toBe(PROGRESS_STEP * 10);
        });

        it("should reach 100 after full simulation", () => {
            const { result } = renderHook(() => useProgress());

            act(() => {
                vi.advanceTimersByTime(TICK_INTERVAL_MS * PROGRESS_END);
            });

            expect(result.current.progress).toBe(PROGRESS_END);
        });

        it("should not exceed 100", () => {
            const { result } = renderHook(() => useProgress());

            act(() => {
                vi.advanceTimersByTime(TICK_INTERVAL_MS * (PROGRESS_END + 50));
            });

            expect(result.current.progress).toBe(PROGRESS_END);
        });

        it("should clear interval on unmount", () => {
            const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");

            const { unmount } = renderHook(() => useProgress());

            act(() => {
                vi.advanceTimersByTime(TICK_INTERVAL_MS * 10);
            });

            unmount();

            expect(clearIntervalSpy).toHaveBeenCalled();

            clearIntervalSpy.mockRestore();
        });
    });

    describe("controlled mode (value provided)", () => {
        it("should return the provided value as progress", () => {
            const { result } = renderHook(() => useProgress(50));

            expect(result.current.progress).toBe(50);
        });

        it("should clamp value to 0 when negative value is passed", () => {
            const { result } = renderHook(() => useProgress(-10));

            expect(result.current.progress).toBe(PROGRESS_START);
        });

        it("should clamp value to 100 when value exceeds 100", () => {
            const { result } = renderHook(() => useProgress(150));

            expect(result.current.progress).toBe(PROGRESS_END);
        });

        it("should update progress when value changes", () => {
            const { rerender, result } = renderHook(
                ({ value }: { value: number }) => useProgress(value),
                { initialProps: { value: 30 } },
            );

            expect(result.current.progress).toBe(30);

            rerender({ value: 70 });

            expect(result.current.progress).toBe(70);
        });

        it("should not start interval simulation", () => {
            const setIntervalSpy = vi.spyOn(globalThis, "setInterval");

            renderHook(() => useProgress(50));

            expect(setIntervalSpy).not.toHaveBeenCalled();

            setIntervalSpy.mockRestore();
        });
    });

      describe("mode switching", () => {
        it("should reset and start simulation when switching from controlled to uncontrolled", () => {
            const { rerender, result } = renderHook(
                ({ value }: { value: number | undefined }) => useProgress(value),
                { initialProps: { value: 50 as number | undefined } },
            );

            expect(result.current.progress).toBe(50);

            rerender({ value: undefined });

            expect(result.current.progress).toBe(PROGRESS_START);

            act(() => {
                vi.advanceTimersByTime(TICK_INTERVAL_MS * 20);
            });

            expect(result.current.progress).toBe(20);
        });

        it("should stop simulation and use value when switching from uncontrolled to controlled", () => {
            const { rerender, result } = renderHook(
                ({ value }: { value: number | undefined }) => useProgress(value),
                { initialProps: { value: undefined as number | undefined } },
            );

            act(() => {
                vi.advanceTimersByTime(TICK_INTERVAL_MS * 10);
            });

            expect(result.current.progress).toBe(10);

            rerender({ value: 80 });

            expect(result.current.progress).toBe(80);

            act(() => {
                vi.advanceTimersByTime(TICK_INTERVAL_MS * 50);
            });

            expect(result.current.progress).toBe(80);
        });
    });
});