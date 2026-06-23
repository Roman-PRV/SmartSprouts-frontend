import {
	BOARD_PADDING,
	CARD_GAP_X,
	CARD_GAP_Y,
	CARD_HEIGHT,
	CARD_WIDTH,
	MAX_COLUMNS,
} from "../../constants/card-board.constant";
import { type CardPosition } from "../../types/card.type";
import { shuffle } from "../shuffle/shuffle.helper";

type ScatterParameters = {
	answerKeys: string[];
	equationKeys: string[];
	random: () => number;
};

type ScatterResult = {
	boardSize: { height: number; width: number };
	positions: Record<string, CardPosition>;
};

const NO_CARDS = 0;
const SINGLE_COLUMN = 1;
const LAST_COLUMN_OFFSET = 1;

// Even grid that fills the board edge to edge (no trailing whitespace): cards are
// placed on a column/row lattice with a fixed pitch. Cells are shuffled so the
// layout still looks mixed, but equations are kept out of the last column —
// equations are fixed and glue an answer to their right, which in the last
// column would run off the board.
//
// Invariant: equationKeys.length <= rows * (columns - 1) (i.e. fits the non-last
// columns). The arithmetic family always satisfies this (10 equations, 16 inner
// cells); a caller that breaks it would leave some equations without a cell.
const scatterCards = ({ answerKeys, equationKeys, random }: ScatterParameters): ScatterResult => {
	const count = equationKeys.length + answerKeys.length;
	const columns = Math.max(SINGLE_COLUMN, Math.min(Math.ceil(Math.sqrt(count)), MAX_COLUMNS));
	const rows = count > NO_CARDS ? Math.ceil(count / columns) : NO_CARDS;

	const pitchX = CARD_WIDTH + CARD_GAP_X;
	const pitchY = CARD_HEIGHT + CARD_GAP_Y;
	const lastColumn = columns - LAST_COLUMN_OFFSET;

	const cells = shuffle(
		Array.from({ length: columns * rows }, (_unused, index) => index),
		random
	);
	const innerCells = cells.filter((cell) => cell % columns !== lastColumn);
	const edgeCells = cells.filter((cell) => cell % columns === lastColumn);

	const equationCells = innerCells.slice(NO_CARDS, equationKeys.length);
	const answerCells = [...innerCells.slice(equationKeys.length), ...edgeCells];

	const positions: Record<string, CardPosition> = {};

	const place = (key: string, cell: number): void => {
		positions[key] = {
			x: BOARD_PADDING + (cell % columns) * pitchX,
			y: BOARD_PADDING + Math.floor(cell / columns) * pitchY,
		};
	};

	for (const [index, key] of equationKeys.entries()) {
		place(key, equationCells[index] as number);
	}

	for (const [index, key] of answerKeys.entries()) {
		place(key, answerCells[index] as number);
	}

	const contentWidth = (columns - SINGLE_COLUMN) * pitchX + CARD_WIDTH;
	const contentHeight = rows > NO_CARDS ? (rows - SINGLE_COLUMN) * pitchY + CARD_HEIGHT : NO_CARDS;

	return {
		boardSize: {
			height: BOARD_PADDING + contentHeight + BOARD_PADDING,
			width: BOARD_PADDING + contentWidth + BOARD_PADDING,
		},
		positions,
	};
};

export { scatterCards };
