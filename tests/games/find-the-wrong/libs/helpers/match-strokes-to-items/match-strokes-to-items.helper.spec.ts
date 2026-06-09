import { describe, expect, it } from "vitest";

import { matchStrokesToItems } from "~/games/find-the-wrong/libs/helpers/match-strokes-to-items/match-strokes-to-items.helper";
import { type MatchableItem } from "~/games/find-the-wrong/libs/types/types";
import { type Point, type Stroke } from "~/libs/types/types";

const buildStroke = (id: string, points: Point[]): Stroke => ({ id, points });

const SQUARE_A: Point[] = [
	[0, 0],
	[1, 0],
	[1, 1],
	[0, 1],
];

const SQUARE_B: Point[] = [
	[2, 2],
	[3, 2],
	[3, 3],
	[2, 3],
];

const ITEMS: MatchableItem[] = [
	{ id: 10, polygon: SQUARE_A },
	{ id: 20, polygon: SQUARE_B },
];

describe("matchStrokesToItems", () => {
	it("returns no found items and all missed when no strokes are provided", () => {
		const result = matchStrokesToItems([], ITEMS);

		expect(result.found).toEqual([]);
		expect(result.missedItemIds).toEqual([10, 20]);
	});

	it("marks items as missed when no stroke point lies inside their polygons", () => {
		const stroke = buildStroke("s1", [
			[5, 5],
			[6, 6],
		]);

		const result = matchStrokesToItems([stroke], ITEMS);

		expect(result.found).toEqual([]);
		expect(result.missedItemIds).toEqual([10, 20]);
	});

	it("marks an item as found with 1 star when the stroke has fewer than 3 points but a point lies inside", () => {
		const stroke = buildStroke("s1", [
			[0.5, 0.5],
			[0.6, 0.6],
		]);

		const result = matchStrokesToItems([stroke], [{ id: 10, polygon: SQUARE_A }]);

		expect(result.found).toHaveLength(1);
		expect(result.found[0]).toMatchObject({ iou: 0, itemId: 10, stars: 1 });
		expect(result.missedItemIds).toEqual([]);
	});

	it("awards 1 star when the stroke covers the polygon weakly (low IoU)", () => {
		const stroke = buildStroke("s1", [
			[0.4, 0.4],
			[0.6, 0.4],
			[0.6, 0.6],
			[0.4, 0.6],
		]);

		const result = matchStrokesToItems([stroke], [{ id: 10, polygon: SQUARE_A }]);

		expect(result.found[0]).toMatchObject({ itemId: 10, stars: 1 });
		expect(result.found[0]?.iou).toBeLessThan(0.2);
	});

	it("awards 2 stars when stroke IoU is at least 0.2 but below 0.5", () => {
		const stroke = buildStroke("s1", [
			[0, 0],
			[0.7, 0],
			[0.7, 0.5],
			[0, 0.5],
		]);

		const result = matchStrokesToItems([stroke], [{ id: 10, polygon: SQUARE_A }]);

		expect(result.found[0]?.stars).toBe(2);
		expect(result.found[0]?.iou).toBeGreaterThanOrEqual(0.2);
		expect(result.found[0]?.iou).toBeLessThan(0.5);
	});

	it("awards 3 stars when stroke IoU reaches 0.5", () => {
		const stroke = buildStroke("s1", [
			[0, 0],
			[1, 0],
			[1, 1],
			[0, 1],
		]);

		const result = matchStrokesToItems([stroke], [{ id: 10, polygon: SQUARE_A }]);

		expect(result.found[0]).toMatchObject({ itemId: 10, stars: 3 });
		expect(result.found[0]?.iou).toBeCloseTo(1);
	});

	it("picks the best-IoU stroke per item when multiple strokes hit", () => {
		const weakStroke = buildStroke("weak", [
			[0.45, 0.45],
			[0.55, 0.45],
			[0.55, 0.55],
			[0.45, 0.55],
		]);
		const strongStroke = buildStroke("strong", [
			[0, 0],
			[1, 0],
			[1, 1],
			[0, 1],
		]);

		const result = matchStrokesToItems([weakStroke, strongStroke], [{ id: 10, polygon: SQUARE_A }]);

		expect(result.found[0]?.stars).toBe(3);
	});

	it("preserves item input order in the missed list", () => {
		const stroke = buildStroke("s1", [
			[0.5, 0.5],
			[0.5, 0.6],
			[0.6, 0.6],
		]);

		const result = matchStrokesToItems([stroke], ITEMS);

		expect(result.found.map((entry) => entry.itemId)).toEqual([10]);
		expect(result.missedItemIds).toEqual([20]);
	});
});
