/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useStrokes } from "~/games/find-the-wrong/libs/hooks/use-strokes/use-strokes.hook";
import { type Point } from "~/libs/types/types";

const POINTS_A: Point[] = [
	[0, 0],
	[0.5, 0.5],
];
const POINTS_B: Point[] = [
	[0.1, 0.1],
	[0.2, 0.2],
	[0.3, 0.3],
];

describe("useStrokes", () => {
	it("starts with an empty list of strokes", () => {
		const { result } = renderHook(() => useStrokes());

		expect(result.current.strokes).toEqual([]);
	});

	it("appends a stroke with a generated id when addStroke is called", () => {
		const { result } = renderHook(() => useStrokes());

		act(() => {
			result.current.addStroke(POINTS_A);
		});

		expect(result.current.strokes).toHaveLength(1);
		expect(result.current.strokes[0]?.points).toEqual(POINTS_A);
		expect(result.current.strokes[0]?.id).toEqual(expect.any(String));
		expect(result.current.strokes[0]?.id.length).toBeGreaterThan(0);
	});

	it("assigns a unique id to each appended stroke", () => {
		const { result } = renderHook(() => useStrokes());

		act(() => {
			result.current.addStroke(POINTS_A);
		});
		act(() => {
			result.current.addStroke(POINTS_B);
		});

		expect(result.current.strokes).toHaveLength(2);
		expect(result.current.strokes[0]?.id).not.toBe(result.current.strokes[1]?.id);
	});

	it("preserves order across multiple addStroke calls", () => {
		const { result } = renderHook(() => useStrokes());

		act(() => {
			result.current.addStroke(POINTS_A);
		});
		act(() => {
			result.current.addStroke(POINTS_B);
		});

		expect(result.current.strokes[0]?.points).toEqual(POINTS_A);
		expect(result.current.strokes[1]?.points).toEqual(POINTS_B);
	});

	it("empties the list when clearAll is called", () => {
		const { result } = renderHook(() => useStrokes());

		act(() => {
			result.current.addStroke(POINTS_A);
			result.current.addStroke(POINTS_B);
		});

		act(() => {
			result.current.clearAll();
		});

		expect(result.current.strokes).toEqual([]);
	});
});
