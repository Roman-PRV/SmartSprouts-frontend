import { describe, expect, it } from "vitest";

import { pointInPolygon } from "~/libs/helpers/point-in-polygon/point-in-polygon.helper";
import { type Point } from "~/libs/types/types";

const UNIT_SQUARE: Point[] = [
	[0, 0],
	[1, 0],
	[1, 1],
	[0, 1],
];

const CONCAVE_ARROW: Point[] = [
	[0, 0],
	[1, 0.5],
	[0, 1],
	[0.4, 0.5],
];

describe("pointInPolygon", () => {
	it("returns true for a point clearly inside the unit square", () => {
		expect(pointInPolygon([0.5, 0.5], UNIT_SQUARE)).toBe(true);
	});

	it("returns false for a point clearly outside the unit square", () => {
		expect(pointInPolygon([2, 2], UNIT_SQUARE)).toBe(false);
	});

	it("returns false for a degenerate polygon (fewer than 3 vertices)", () => {
		expect(pointInPolygon([0.5, 0.5], [[0, 0], [1, 1]])).toBe(false);
	});

	it("classifies a point in the convex part of a concave polygon as inside", () => {
		expect(pointInPolygon([0.6, 0.5], CONCAVE_ARROW)).toBe(true);
	});

	it("classifies a point in the concave notch as outside", () => {
		expect(pointInPolygon([0.2, 0.5], CONCAVE_ARROW)).toBe(false);
	});

	it("handles points far from the polygon without error", () => {
		expect(pointInPolygon([-100, -100], UNIT_SQUARE)).toBe(false);
	});

	it("returns false for a point on the right edge (documented boundary behavior)", () => {
		expect(pointInPolygon([1, 0.5], UNIT_SQUARE)).toBe(false);
	});
});
