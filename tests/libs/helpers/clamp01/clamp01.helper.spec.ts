import { describe, expect, it } from "vitest";

import { clamp01 } from "~/libs/helpers/clamp01/clamp01.helper";

describe("clamp01", () => {
	it("returns 0 for a negative value", () => {
		expect(clamp01(-0.5)).toBe(0);
	});

	it("returns 0 for exactly 0", () => {
		expect(clamp01(0)).toBe(0);
	});

	it("returns the value unchanged when inside the range", () => {
		expect(clamp01(0.42)).toBe(0.42);
	});

	it("returns 1 for exactly 1", () => {
		expect(clamp01(1)).toBe(1);
	});

	it("returns 1 for a value above 1", () => {
		expect(clamp01(1.7)).toBe(1);
	});
});
