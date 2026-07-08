import { FIRST_INDEX, UI_INDEX_BASE } from "~/libs/constants/constants";

// Deterministic Fisher–Yates shuffle driven by the supplied PRNG, so the same
// seed always produces the same order. Returns a new array; the input is left
// untouched.
const shuffle = <Item>(items: Item[], random: () => number): Item[] => {
	const result = [...items];

	for (let index = result.length - UI_INDEX_BASE; index > FIRST_INDEX; index -= UI_INDEX_BASE) {
		const target = Math.floor(random() * (index + UI_INDEX_BASE));
		const current = result[index] as Item;

		result[index] = result[target] as Item;
		result[target] = current;
	}

	return result;
};

export { shuffle };
