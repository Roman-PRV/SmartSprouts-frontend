/**
 * @vitest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useMatchResult } from "~/games/find-the-wrong/libs/hooks/use-match-result/use-match-result.hook";
import { type MatchableItem } from "~/games/find-the-wrong/libs/types/types";
import { type Stroke } from "~/libs/types/types";

const UNIT_SQUARE = [
	[0, 0],
	[1, 0],
	[1, 1],
	[0, 1],
] as const;

const buildItems = (): MatchableItem[] => [{ id: 10, polygon: UNIT_SQUARE.map(([x, y]) => [x, y]) }];

const buildStrokes = (): Stroke[] => [
	{
		id: "s1",
		points: [
			[0.5, 0.5],
			[0.6, 0.6],
			[0.7, 0.7],
		],
	},
];

const renderMatch = (initialStrokes: Stroke[], initialItems: MatchableItem[]) =>
	renderHook(({ items, strokes }) => useMatchResult(strokes, items), {
		initialProps: { items: initialItems, strokes: initialStrokes },
	});

describe("useMatchResult", () => {
	it("computes the match result on initial render", () => {
		const { result } = renderMatch(buildStrokes(), buildItems());

		expect(result.current.found).toHaveLength(1);
		expect(result.current.found[0]?.itemId).toBe(10);
	});

	it("returns the same result reference when inputs are unchanged", () => {
		const strokes = buildStrokes();
		const items = buildItems();
		const { rerender, result } = renderMatch(strokes, items);
		const first = result.current;

		rerender({ items, strokes });

		expect(result.current).toBe(first);
	});

	it("recomputes when strokes change", () => {
		const items = buildItems();
		const { rerender, result } = renderMatch(buildStrokes(), items);
		const first = result.current;

		rerender({ items, strokes: [] });

		expect(result.current).not.toBe(first);
		expect(result.current.found).toEqual([]);
		expect(result.current.missedItemIds).toEqual([10]);
	});

	it("recomputes when items change", () => {
		const strokes = buildStrokes();
		const { rerender, result } = renderMatch(strokes, buildItems());
		const first = result.current;

		rerender({ items: [], strokes });

		expect(result.current).not.toBe(first);
		expect(result.current.found).toEqual([]);
		expect(result.current.missedItemIds).toEqual([]);
	});
});
