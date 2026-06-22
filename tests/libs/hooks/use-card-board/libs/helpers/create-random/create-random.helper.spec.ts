import { describe, expect, it } from "vitest";

import { createRandom } from "~/libs/hooks/use-card-board/libs/helpers/create-random/create-random.helper";

const SEED = 4242;
const OTHER_SEED = 8514;
const DRAW_COUNT = 5;

const drawSequence = (random: () => number, count: number): number[] =>
	Array.from({ length: count }, () => random());

describe("createRandom", () => {
	it("produces the same sequence for the same seed", () => {
		const first = drawSequence(createRandom(SEED), DRAW_COUNT);
		const second = drawSequence(createRandom(SEED), DRAW_COUNT);

		expect(first).toEqual(second);
	});

	it("produces a different sequence for a different seed", () => {
		const first = drawSequence(createRandom(SEED), DRAW_COUNT);
		const other = drawSequence(createRandom(OTHER_SEED), DRAW_COUNT);

		expect(first).not.toEqual(other);
	});

	it("returns values in the [0, 1) range", () => {
		const values = drawSequence(createRandom(SEED), DRAW_COUNT);

		for (const value of values) {
			expect(value).toBeGreaterThanOrEqual(0);
			expect(value).toBeLessThan(1);
		}
	});
});
