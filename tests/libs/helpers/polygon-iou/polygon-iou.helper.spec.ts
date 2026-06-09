import { describe, expect, it } from "vitest";

import { polygonIoU } from "~/libs/helpers/polygon-iou/polygon-iou.helper";
import { type Point } from "~/libs/types/types";

const UNIT_SQUARE: Point[] = [
	[0, 0],
	[1, 0],
	[1, 1],
	[0, 1],
];

const SHIFTED_HALF_OVERLAP_SQUARE: Point[] = [
	[0.5, 0],
	[1.5, 0],
	[1.5, 1],
	[0.5, 1],
];

const DISJOINT_SQUARE: Point[] = [
	[10, 10],
	[11, 10],
	[11, 11],
	[10, 11],
];

const HALF_UNIT_SQUARE: Point[] = [
	[0, 0],
	[0.5, 0],
	[0.5, 0.5],
	[0, 0.5],
];

describe("polygonIoU", () => {
	it("returns 1 for identical polygons", () => {
		expect(polygonIoU(UNIT_SQUARE, UNIT_SQUARE)).toBeCloseTo(1);
	});

	it("returns ~0.333 for two unit squares overlapping by half (intersection 0.5, union 1.5)", () => {
		expect(polygonIoU(UNIT_SQUARE, SHIFTED_HALF_OVERLAP_SQUARE)).toBeCloseTo(1 / 3);
	});

	it("returns 0 for disjoint polygons", () => {
		expect(polygonIoU(UNIT_SQUARE, DISJOINT_SQUARE)).toBe(0);
	});

	it("returns the ratio of areas when one polygon is contained in the other (0.25 / 1)", () => {
		expect(polygonIoU(HALF_UNIT_SQUARE, UNIT_SQUARE)).toBeCloseTo(0.25);
	});

	it("returns 0 for a degenerate polygon (fewer than 3 vertices)", () => {
		expect(polygonIoU([[0, 0], [1, 1]], UNIT_SQUARE)).toBe(0);
	});
});
