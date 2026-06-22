import { describe, expect, it } from "vitest";

import { createRandom } from "~/libs/hooks/use-card-board/libs/helpers/create-random/create-random.helper";
import { shuffle } from "~/libs/hooks/use-card-board/libs/helpers/shuffle/shuffle.helper";

const SEED = 777;
const ITEMS = [1, 2, 3, 4, 5, 6, 7, 8];

describe("shuffle", () => {
	it("produces the same order for the same seed", () => {
		const first = shuffle(ITEMS, createRandom(SEED));
		const second = shuffle(ITEMS, createRandom(SEED));

		expect(first).toEqual(second);
	});

	it("does not mutate the input array", () => {
		const input = [...ITEMS];

		shuffle(input, createRandom(SEED));

		expect(input).toEqual(ITEMS);
	});

	it("preserves the multiset of items", () => {
		const result = shuffle(ITEMS, createRandom(SEED));

		expect([...result].sort((a, b) => a - b)).toEqual([...ITEMS].sort((a, b) => a - b));
	});

	it("actually reorders for at least one seed", () => {
		const result = shuffle(ITEMS, createRandom(SEED));

		expect(result).not.toEqual(ITEMS);
	});
});
