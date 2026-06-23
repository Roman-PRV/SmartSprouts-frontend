import { describe, expect, it } from "vitest";

import { cardOverlapArea } from "~/libs/hooks/use-card-board/libs/helpers/card-overlap-area/card-overlap-area.helper";

// Cards are 110 x 64 (see card-board.constant).
describe("cardOverlapArea", () => {
	it("is the full card area for identical positions", () => {
		expect(cardOverlapArea({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(110 * 64);
	});

	it("is zero when the boxes only touch edge to edge", () => {
		expect(cardOverlapArea({ x: 110, y: 0 }, { x: 0, y: 0 })).toBe(0);
	});

	it("is zero when the boxes are apart", () => {
		expect(cardOverlapArea({ x: 300, y: 0 }, { x: 0, y: 0 })).toBe(0);
	});

	it("measures a partial overlap", () => {
		// 60px shared horizontally, full 64px vertically.
		expect(cardOverlapArea({ x: 50, y: 0 }, { x: 0, y: 0 })).toBe(60 * 64);
	});
});
