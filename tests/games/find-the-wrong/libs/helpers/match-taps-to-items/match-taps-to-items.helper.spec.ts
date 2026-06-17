import { describe, expect, it } from "vitest";

import { matchTapsToItems } from "~/games/find-the-wrong/libs/helpers/match-taps-to-items/match-taps-to-items.helper";
import { type Marker, type MatchableItem } from "~/games/find-the-wrong/libs/types/types";
import { type Point } from "~/libs/types/types";

const LEVEL_START_MS = 0;

const square = (offsetX: number): Point[] => [
	[offsetX, 0],
	[offsetX + 0.2, 0],
	[offsetX + 0.2, 0.2],
	[offsetX, 0.2],
];

const ITEM_A: MatchableItem = { id: 1, polygon: square(0) };
const ITEM_B: MatchableItem = { id: 2, polygon: square(0.5) };

const marker = (point: Point, atSeconds: number): Marker => ({
	id: `m-${String(atSeconds)}-${point.join(",")}`,
	placedAtMs: LEVEL_START_MS + atSeconds * 1000,
	point,
});

describe("matchTapsToItems", () => {
	it("marks an item found when a tap falls inside it, missed otherwise", () => {
		const markers = [marker([0.1, 0.1], 10)];

		const result = matchTapsToItems(markers, [ITEM_A, ITEM_B], LEVEL_START_MS);

		expect(result.found).toEqual([{ itemId: 1, stars: 3 }]);
		expect(result.missedItemIds).toEqual([2]);
	});

	it("awards 3 stars under 60s and 2 stars at exactly 60s", () => {
		expect(matchTapsToItems([marker([0.1, 0.1], 59)], [ITEM_A], LEVEL_START_MS).found[0]?.stars).toBe(3);
		expect(matchTapsToItems([marker([0.1, 0.1], 60)], [ITEM_A], LEVEL_START_MS).found[0]?.stars).toBe(2);
	});

	it("awards 2 stars under 180s and 1 star at exactly 180s", () => {
		expect(matchTapsToItems([marker([0.1, 0.1], 179)], [ITEM_A], LEVEL_START_MS).found[0]?.stars).toBe(2);
		expect(matchTapsToItems([marker([0.1, 0.1], 180)], [ITEM_A], LEVEL_START_MS).found[0]?.stars).toBe(1);
	});

	it("uses the earliest containing tap when several fall inside one item", () => {
		const markers = [marker([0.1, 0.1], 200), marker([0.15, 0.15], 30)];

		const result = matchTapsToItems(markers, [ITEM_A], LEVEL_START_MS);

		expect(result.found).toEqual([{ itemId: 1, stars: 3 }]);
	});

	it("never reports an IoU for marker results", () => {
		const result = matchTapsToItems([marker([0.1, 0.1], 10)], [ITEM_A], LEVEL_START_MS);

		expect(result.found[0]).not.toHaveProperty("iou");
	});
});
