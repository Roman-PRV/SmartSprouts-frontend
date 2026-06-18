import { describe, expect, it } from "vitest";

import { pointInPolygon } from "~/libs/helpers/point-in-polygon/point-in-polygon.helper";
import { type Point } from "~/libs/types/types";

const UNIT_SQUARE: Point[] = [
	[0, 0],
	[1, 0],
	[1, 1],
	[0, 1],
];

describe("pointInPolygon", () => {
	it("returns true for a point inside the polygon", () => {
		expect(pointInPolygon([0.5, 0.5], UNIT_SQUARE)).toBe(true);
	});

	it("returns false for a point outside the polygon", () => {
		expect(pointInPolygon([1.5, 0.5], UNIT_SQUARE)).toBe(false);
	});

	it("returns false for a point in a non-convex notch", () => {
		const lShape: Point[] = [
			[0, 0],
			[0.4, 0],
			[0.4, 0.4],
			[1, 0.4],
			[1, 1],
			[0, 1],
		];

		expect(pointInPolygon([0.7, 0.2], lShape)).toBe(false);
		expect(pointInPolygon([0.2, 0.2], lShape)).toBe(true);
	});

	it("returns false for a polygon with fewer than three vertices", () => {
		expect(
			pointInPolygon([0.5, 0.5], [
				[0, 0],
				[1, 1],
			])
		).toBe(false);
	});
});
