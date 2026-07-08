import { describe, expect, it } from "vitest";

import { cardsOverlap } from "~/libs/hooks/use-card-board/libs/helpers/cards-overlap/cards-overlap.helper";

// Cards are 110 x 64 (see card-board.constant).
describe("cardsOverlap", () => {
	it("is true when a box covers another", () => {
		expect(cardsOverlap({ x: 10, y: 10 }, [{ x: 0, y: 0 }])).toBe(true);
	});

	it("is false when boxes only touch edge to edge", () => {
		expect(cardsOverlap({ x: 110, y: 0 }, [{ x: 0, y: 0 }])).toBe(false);
	});

	it("is false when boxes are clear of each other", () => {
		expect(cardsOverlap({ x: 300, y: 300 }, [{ x: 0, y: 0 }])).toBe(false);
	});

	it("is false against an empty list", () => {
		expect(cardsOverlap({ x: 0, y: 0 }, [])).toBe(false);
	});
});
