/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useTapDetection } from "~/libs/hooks/use-tap-detection/use-tap-detection.hook";
import { type Point } from "~/libs/types/types";

const toNormalized = (pixel: Point): Point => [pixel[0] / 100, pixel[1] / 100];

describe("useTapDetection", () => {
	it("fires onTap (in normalized coords) for a stationary pointer up", () => {
		const onTap = vi.fn();
		const { result } = renderHook(() => useTapDetection(toNormalized, true, onTap));

		act(() => {
			result.current.handlers.onStart([50, 50]);
		});
		act(() => {
			result.current.handlers.onEnd();
		});

		expect(onTap).toHaveBeenCalledWith([0.5, 0.5]);
	});

	it("fires onTap when movement stays within tolerance", () => {
		const onTap = vi.fn();
		const { result } = renderHook(() => useTapDetection(toNormalized, true, onTap));

		act(() => {
			result.current.handlers.onStart([50, 50]);
		});
		act(() => {
			result.current.handlers.onMove([53, 54]);
		});
		act(() => {
			result.current.handlers.onEnd();
		});

		expect(onTap).toHaveBeenCalledWith([0.53, 0.54]);
	});

	it("ignores a drag beyond tolerance", () => {
		const onTap = vi.fn();
		const { result } = renderHook(() => useTapDetection(toNormalized, true, onTap));

		act(() => {
			result.current.handlers.onStart([10, 10]);
		});
		act(() => {
			result.current.handlers.onMove([40, 40]);
		});
		act(() => {
			result.current.handlers.onEnd();
		});

		expect(onTap).not.toHaveBeenCalled();
	});

	it("ignores movement while disabled (no phantom tap)", () => {
		const onTap = vi.fn();
		const { result } = renderHook(() => useTapDetection(toNormalized, false, onTap));

		act(() => {
			result.current.handlers.onStart([10, 10]);
		});
		act(() => {
			result.current.handlers.onMove([12, 12]);
		});
		act(() => {
			result.current.handlers.onEnd();
		});

		expect(onTap).not.toHaveBeenCalled();
	});

	it("does nothing when disabled", () => {
		const onTap = vi.fn();
		const { result } = renderHook(() => useTapDetection(toNormalized, false, onTap));

		act(() => {
			result.current.handlers.onStart([50, 50]);
		});
		act(() => {
			result.current.handlers.onEnd();
		});

		expect(onTap).not.toHaveBeenCalled();
	});

	it("cancel aborts the in-flight tap", () => {
		const onTap = vi.fn();
		const { result } = renderHook(() => useTapDetection(toNormalized, true, onTap));

		act(() => {
			result.current.handlers.onStart([50, 50]);
		});
		act(() => {
			result.current.handlers.onCancel();
		});
		act(() => {
			result.current.handlers.onEnd();
		});

		expect(onTap).not.toHaveBeenCalled();
	});
});
