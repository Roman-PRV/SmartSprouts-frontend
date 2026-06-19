import { describe, expect, it } from "vitest";

import { parseLevelId } from "~/modules/admin/libs/helpers/parse-level-id.helper";

describe("parseLevelId", () => {
	it("returns the parsed integer for a positive integer string", () => {
		expect(parseLevelId("42")).toBe(42);
	});

	it("returns 1 for the minimum valid level id", () => {
		expect(parseLevelId("1")).toBe(1);
	});

	it("returns null for undefined", () => {
		expect(parseLevelId()).toBeNull();
	});

	it("returns null for an empty string", () => {
		expect(parseLevelId("")).toBeNull();
	});

	it("returns null for a non-numeric string", () => {
		expect(parseLevelId("abc")).toBeNull();
	});

	it("returns null for a float", () => {
		expect(parseLevelId("4.2")).toBeNull();
	});

	it("returns null for zero", () => {
		expect(parseLevelId("0")).toBeNull();
	});

	it("returns null for a negative integer", () => {
		expect(parseLevelId("-5")).toBeNull();
	});
});
