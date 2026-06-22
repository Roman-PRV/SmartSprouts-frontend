import { describe, expect, it } from "vitest";

import { distanceBetween } from "~/libs/hooks/use-card-board/libs/helpers/distance-between/distance-between.helper";

describe("distanceBetween", () => {
	it("is zero for the same point", () => {
		expect(distanceBetween({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(0);
	});

	it("measures a pure horizontal gap", () => {
		expect(distanceBetween({ x: 0, y: 0 }, { x: 3, y: 0 })).toBe(3);
	});

	it("measures the hypotenuse of a 3-4-5 triangle", () => {
		expect(distanceBetween({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
	});
});
