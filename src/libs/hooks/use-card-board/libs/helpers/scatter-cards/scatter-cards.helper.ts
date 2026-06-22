import {
	BOARD_PADDING,
	CARD_GAP,
	CARD_HEIGHT,
	CARD_JITTER_RATIO,
	CARD_WIDTH,
} from "../../constants/card-board.constant";
import { type CardPosition } from "../../types/card.type";
import { shuffle } from "../shuffle/shuffle.helper";

type ScatterResult = {
	boardSize: { height: number; width: number };
	positions: Record<string, CardPosition>;
};

// Deterministic non-overlapping scatter. Cards are laid on a grid of cells sized
// card + gap, each card assigned a distinct (shuffled) cell and jittered within
// it by less than the gap — so no two card boxes can ever intersect.
const scatterCards = (keys: string[], random: () => number): ScatterResult => {
	const count = keys.length;
	const columns = Math.ceil(Math.sqrt(count));
	const rows = Math.ceil(count / columns);

	const cellWidth = CARD_WIDTH + CARD_GAP;
	const cellHeight = CARD_HEIGHT + CARD_GAP;
	const jitterRange = CARD_GAP * CARD_JITTER_RATIO;

	const cellOrder = shuffle(
		Array.from({ length: columns * rows }, (_unused, index) => index),
		random
	);

	const positions: Record<string, CardPosition> = {};

	for (const [index, key] of keys.entries()) {
		const cell = cellOrder[index] as number;
		const column = cell % columns;
		const row = Math.floor(cell / columns);

		positions[key] = {
			x: BOARD_PADDING + column * cellWidth + random() * jitterRange,
			y: BOARD_PADDING + row * cellHeight + random() * jitterRange,
		};
	}

	return {
		boardSize: {
			height: BOARD_PADDING + rows * cellHeight + BOARD_PADDING,
			width: BOARD_PADDING + columns * cellWidth + BOARD_PADDING,
		},
		positions,
	};
};

export { scatterCards };
