import { describe, expect, it } from "vitest";

import { segmentCrossesPolygon } from "~/libs/helpers/segment-crosses-polygon/segment-crosses-polygon.helper";
import { type Point } from "~/libs/types/types";

const UNIT_SQUARE: Point[] = [
	[0, 0],
	[1, 0],
	[1, 1],
	[0, 1],
];

describe("segmentCrossesPolygon", () => {
	it("returns true for a segment that crosses one edge", () => {
		expect(segmentCrossesPolygon([0.5, -0.5], [0.5, 0.5], UNIT_SQUARE)).toBe(true);
	});

	it("returns true for a segment that crosses two edges (enters and exits)", () => {
		expect(segmentCrossesPolygon([-0.5, 0.5], [1.5, 0.5], UNIT_SQUARE)).toBe(true);
	});

	it("returns false for a segment completely outside the polygon", () => {
		expect(segmentCrossesPolygon([2, 2], [3, 3], UNIT_SQUARE)).toBe(false);
	});

	it("returns false for a segment fully contained inside (no edge crossed)", () => {
		expect(segmentCrossesPolygon([0.25, 0.25], [0.75, 0.75], UNIT_SQUARE)).toBe(false);
	});

	it("returns false for a degenerate polygon", () => {
		expect(segmentCrossesPolygon([0, 0], [1, 1], [[0, 0], [1, 0]])).toBe(false);
	});

	it("returns false for a segment lying along a polygon edge (documented boundary behavior)", () => {
		expect(segmentCrossesPolygon([0, 0], [1, 0], UNIT_SQUARE)).toBe(false);
	});
});
