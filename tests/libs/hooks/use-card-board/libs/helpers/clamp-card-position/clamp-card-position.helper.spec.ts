import { describe, expect, it } from "vitest";

import { clampCardPosition } from "~/libs/hooks/use-card-board/libs/helpers/clamp-card-position/clamp-card-position.helper";

// Card 110 x 64, BOARD_PADDING 20 (see card-board.constant).
const BOARD_SIZE = { height: 400, width: 600 };

describe("clampCardPosition", () => {
	it("keeps a position that is already inside untouched", () => {
		const result = clampCardPosition({
			boardSize: BOARD_SIZE,
			position: { x: 200, y: 150 },
		});

		expect(result).toEqual({ x: 200, y: 150 });
	});

	it("pulls a card back inside the padding on the top-left", () => {
		const result = clampCardPosition({
			boardSize: BOARD_SIZE,
			position: { x: -50, y: -50 },
		});

		expect(result).toEqual({ x: 20, y: 20 });
	});

	it("stops a card before the right/bottom padding", () => {
		const result = clampCardPosition({
			boardSize: BOARD_SIZE,
			position: { x: 9999, y: 9999 },
		});

		// 600 - 110 - 20 = 470 ; 400 - 64 - 20 = 316
		expect(result).toEqual({ x: 470, y: 316 });
	});
});
