import { describe, expect, it } from "vitest";

import { matchStrokesToItems } from "~/games/find-the-wrong/libs/helpers/match-strokes-to-items/match-strokes-to-items.helper";
import { type MatchableItem } from "~/games/find-the-wrong/libs/types/types";
import { type Point, type Stroke } from "~/libs/types/types";

const buildStroke = (id: string, points: Point[]): Stroke => ({ id, points });

// Unit square, area = 1. IoU of a loop fully containing it is 1 / loopArea.
const UNIT_SQUARE: Point[] = [
	[0, 0],
	[1, 0],
	[1, 1],
	[0, 1],
];

/**
 * Closed square loop centered on (0.5, 0.5) with the given half-extent: the pen
 * returns to its start, so it passes the closed-loop check. Area = (2h)².
 */
const closedSquareLoop = (halfExtent: number): Point[] => {
	const low = 0.5 - halfExtent;
	const high = 0.5 + halfExtent;

	return [
		[low, low],
		[high, low],
		[high, high],
		[low, high],
		[low, low],
	];
};

const ITEMS: MatchableItem[] = [
	{ id: 10, polygon: UNIT_SQUARE },
	{ id: 20, polygon: [...closedSquareLoop(0.5)].map(([x, y]) => [x + 5, y + 5] as Point) },
];

describe("matchStrokesToItems", () => {
	it("returns no found items and all missed when no strokes are provided", () => {
		const result = matchStrokesToItems([], ITEMS);

		expect(result.found).toEqual([]);
		expect(result.missedItemIds).toEqual([10, 20]);
	});

	it("ignores an open arc even though auto-closing it would overlap the object", () => {
		// Endpoints [0,0] and [1,0] are a full bbox-width apart → not a closed
		// loop. Auto-closing this into a triangle (area 0.5, IoU 0.5) must NOT
		// count as a match.
		const stroke = buildStroke("arc", [
			[0, 0],
			[1, 1],
			[1, 0],
		]);

		const result = matchStrokesToItems([stroke], [{ id: 10, polygon: UNIT_SQUARE }]);

		expect(result.found).toEqual([]);
		expect(result.missedItemIds).toEqual([10]);
	});

	it("misses a closed loop that does not overlap the object", () => {
		const stroke = buildStroke("far", closedSquareLoop(0.5).map(([x, y]) => [x + 5, y + 5] as Point));

		const result = matchStrokesToItems([stroke], [{ id: 10, polygon: UNIT_SQUARE }]);

		expect(result.found).toEqual([]);
		expect(result.missedItemIds).toEqual([10]);
	});

	it("misses a closed loop with negligible enclosed area", () => {
		const stroke = buildStroke("sliver", [
			[0, 0.5],
			[1, 0.5],
			[1, 0.51],
			[0, 0.51],
			[0, 0.5],
		]);

		const result = matchStrokesToItems([stroke], [{ id: 10, polygon: UNIT_SQUARE }]);

		expect(result.found).toEqual([]);
		expect(result.missedItemIds).toEqual([10]);
	});

	it("misses a tap or 2-point stroke that cannot enclose area", () => {
		const stroke = buildStroke("tap", [
			[0.5, 0.5],
			[0.6, 0.6],
		]);

		const result = matchStrokesToItems([stroke], [{ id: 10, polygon: UNIT_SQUARE }]);

		expect(result.found).toEqual([]);
		expect(result.missedItemIds).toEqual([10]);
	});

	it("misses a catch-all loop that encloses the object loosely (loopArea≈10, IoU≈0.1)", () => {
		const stroke = buildStroke("catch-all", closedSquareLoop(1.581));

		const result = matchStrokesToItems([stroke], [{ id: 10, polygon: UNIT_SQUARE }]);

		expect(result.found).toEqual([]);
		expect(result.missedItemIds).toEqual([10]);
	});

	it("finds with 1 star a loose-but-targeted loop (loopArea≈5, IoU≈0.2)", () => {
		const stroke = buildStroke("loose", closedSquareLoop(1.118));

		const result = matchStrokesToItems([stroke], [{ id: 10, polygon: UNIT_SQUARE }]);

		expect(result.found[0]).toMatchObject({ itemId: 10, stars: 1 });
		expect(result.found[0]?.iou).toBeGreaterThanOrEqual(0.12);
		expect(result.found[0]?.iou).toBeLessThan(0.3);
	});

	it("finds with 2 stars a moderate loop (loopArea≈3, IoU≈0.33)", () => {
		const stroke = buildStroke("moderate", closedSquareLoop(0.866));

		const result = matchStrokesToItems([stroke], [{ id: 10, polygon: UNIT_SQUARE }]);

		expect(result.found[0]?.stars).toBe(2);
		expect(result.found[0]?.iou).toBeGreaterThanOrEqual(0.3);
		expect(result.found[0]?.iou).toBeLessThan(0.5);
	});

	it("finds with 3 stars a tight loop matching the object (IoU≈1)", () => {
		const stroke = buildStroke("tight", closedSquareLoop(0.5));

		const result = matchStrokesToItems([stroke], [{ id: 10, polygon: UNIT_SQUARE }]);

		expect(result.found[0]).toMatchObject({ itemId: 10, stars: 3 });
		expect(result.found[0]?.iou).toBeCloseTo(1);
	});

	it("picks the best-IoU stroke per item when several overlap", () => {
		const looseStroke = buildStroke("loose", closedSquareLoop(1.118));
		const tightStroke = buildStroke("tight", closedSquareLoop(0.5));

		const result = matchStrokesToItems(
			[looseStroke, tightStroke],
			[{ id: 10, polygon: UNIT_SQUARE }]
		);

		expect(result.found[0]?.stars).toBe(3);
	});

	it("preserves item input order in the missed list", () => {
		const stroke = buildStroke("tight", closedSquareLoop(0.5));

		const result = matchStrokesToItems([stroke], ITEMS);

		expect(result.found.map((entry) => entry.itemId)).toEqual([10]);
		expect(result.missedItemIds).toEqual([20]);
	});
});
