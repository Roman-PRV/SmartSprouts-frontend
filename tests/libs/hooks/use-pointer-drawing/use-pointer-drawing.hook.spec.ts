/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { usePointerDrawing } from "~/libs/hooks/use-pointer-drawing/use-pointer-drawing.hook";
import { type Point } from "~/libs/types/types";

const identityNormalize = (pixel: Point): Point => pixel;
const halfNormalize = (pixel: Point): Point => [pixel[0] / 2, pixel[1] / 2];

describe("usePointerDrawing", () => {
	it("starts with no in-flight points", () => {
		const { result } = renderHook(() => usePointerDrawing(identityNormalize, true));

		expect(result.current.inFlightPoints).toEqual([]);
	});

	it("collects points across start and move when enabled", () => {
		const { result } = renderHook(() => usePointerDrawing(identityNormalize, true));

		act(() => {
			result.current.handlers.onStart([1, 2]);
		});
		act(() => {
			result.current.handlers.onMove([3, 4]);
		});
		act(() => {
			result.current.handlers.onMove([5, 6]);
		});

		expect(result.current.inFlightPoints).toEqual([
			[1, 2],
			[3, 4],
			[5, 6],
		]);
	});

	it("ignores pointer events when disabled", () => {
		const onComplete = vi.fn();
		const { result } = renderHook(() => usePointerDrawing(identityNormalize, false, onComplete));

		act(() => {
			result.current.handlers.onStart([1, 2]);
		});
		act(() => {
			result.current.handlers.onMove([3, 4]);
		});
		act(() => {
			result.current.handlers.onEnd();
		});

		expect(result.current.inFlightPoints).toEqual([]);
		expect(onComplete).not.toHaveBeenCalled();
	});

	it("calls onComplete with collected points on end and resets in-flight state", () => {
		const onComplete = vi.fn();
		const { result } = renderHook(() => usePointerDrawing(identityNormalize, true, onComplete));

		act(() => {
			result.current.handlers.onStart([10, 20]);
		});
		act(() => {
			result.current.handlers.onMove([30, 40]);
		});
		act(() => {
			result.current.handlers.onEnd();
		});

		expect(onComplete).toHaveBeenCalledWith([
			[10, 20],
			[30, 40],
		]);
		expect(result.current.inFlightPoints).toEqual([]);
	});

	it("does NOT call onComplete on cancel and discards the in-flight stroke", () => {
		const onComplete = vi.fn();
		const { result } = renderHook(() => usePointerDrawing(identityNormalize, true, onComplete));

		act(() => {
			result.current.handlers.onStart([1, 1]);
		});
		act(() => {
			result.current.handlers.onMove([2, 2]);
		});
		act(() => {
			result.current.handlers.onCancel();
		});

		expect(onComplete).not.toHaveBeenCalled();
		expect(result.current.inFlightPoints).toEqual([]);
	});

	it("treats subsequent onStart after onCancel as a fresh stroke", () => {
		const onComplete = vi.fn();
		const { result } = renderHook(() => usePointerDrawing(identityNormalize, true, onComplete));

		act(() => {
			result.current.handlers.onStart([1, 1]);
		});
		act(() => {
			result.current.handlers.onCancel();
		});
		act(() => {
			result.current.handlers.onStart([9, 9]);
		});
		act(() => {
			result.current.handlers.onEnd();
		});

		expect(onComplete).toHaveBeenCalledTimes(1);
		expect(onComplete).toHaveBeenCalledWith([[9, 9]]);
	});

	it("applies toNormalized to each captured pixel", () => {
		const { result } = renderHook(() => usePointerDrawing(halfNormalize, true));

		act(() => {
			result.current.handlers.onStart([100, 200]);
		});
		act(() => {
			result.current.handlers.onMove([300, 400]);
		});

		expect(result.current.inFlightPoints).toEqual([
			[50, 100],
			[150, 200],
		]);
	});

	it("auto-cancels an in-flight stroke when enabled flips to false", () => {
		const onComplete = vi.fn();
		const { rerender, result } = renderHook(
			({ enabled }) => usePointerDrawing(identityNormalize, enabled, onComplete),
			{ initialProps: { enabled: true } }
		);

		act(() => {
			result.current.handlers.onStart([1, 1]);
		});
		act(() => {
			result.current.handlers.onMove([2, 2]);
		});

		rerender({ enabled: false });

		expect(result.current.inFlightPoints).toEqual([]);
		expect(onComplete).not.toHaveBeenCalled();
	});

	it("cleans up but does not commit when onEnd fires after disable", () => {
		const onComplete = vi.fn();
		const { rerender, result } = renderHook(
			({ enabled }) => usePointerDrawing(identityNormalize, enabled, onComplete),
			{ initialProps: { enabled: true } }
		);

		act(() => {
			result.current.handlers.onStart([1, 1]);
		});

		rerender({ enabled: false });

		act(() => {
			result.current.handlers.onEnd();
		});

		expect(result.current.inFlightPoints).toEqual([]);
		expect(onComplete).not.toHaveBeenCalled();
	});

	it("accepts a fresh stroke after a mid-stroke disable + re-enable cycle", () => {
		const onComplete = vi.fn();
		const { rerender, result } = renderHook(
			({ enabled }) => usePointerDrawing(identityNormalize, enabled, onComplete),
			{ initialProps: { enabled: true } }
		);

		act(() => {
			result.current.handlers.onStart([1, 1]);
		});

		rerender({ enabled: false });
		rerender({ enabled: true });

		act(() => {
			result.current.handlers.onStart([9, 9]);
		});
		act(() => {
			result.current.handlers.onEnd();
		});

		expect(onComplete).toHaveBeenCalledTimes(1);
		expect(onComplete).toHaveBeenCalledWith([[9, 9]]);
	});
});
