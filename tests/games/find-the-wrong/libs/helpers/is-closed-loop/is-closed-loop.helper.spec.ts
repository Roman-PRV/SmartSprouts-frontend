import { describe, expect, it } from "vitest";

import { isClosedLoop } from "~/games/find-the-wrong/libs/helpers/is-closed-loop/is-closed-loop.helper";
import { type Point } from "~/libs/types/types";

describe("isClosedLoop", () => {
	it("treats a loop whose endpoints meet as closed", () => {
		const closed: Point[] = [
			[0, 0],
			[1, 0],
			[1, 1],
			[0, 1],
			[0, 0],
		];

		expect(isClosedLoop(closed)).toBe(true);
	});

	it("treats an open arc (endpoints far apart) as not closed", () => {
		const openArc: Point[] = [
			[0, 0],
			[0.5, 0.1],
			[1, 0],
		];

		expect(isClosedLoop(openArc)).toBe(false);
	});

	it("returns false for fewer than two points", () => {
		expect(isClosedLoop([[0.5, 0.5]])).toBe(false);
		expect(isClosedLoop([])).toBe(false);
	});

	it("returns false for a degenerate zero-area stroke", () => {
		expect(
			isClosedLoop([
				[0.5, 0.5],
				[0.5, 0.5],
			])
		).toBe(false);
	});
});
