import { BOARD_PADDING, CARD_HEIGHT, CARD_WIDTH } from "../../constants/card-board.constant";
import { type CardPosition } from "../../types/card.type";

type ClampParameters = {
	boardSize: { height: number; width: number };
	position: CardPosition;
};

const clamp = (value: number, min: number, max: number): number =>
	Math.min(Math.max(value, min), Math.max(min, max));

// Keep a dragged card inside the board, never closer to an edge than the
// padding, so cards can never be dragged off the field.
const clampCardPosition = ({ boardSize, position }: ClampParameters): CardPosition => ({
	x: clamp(position.x, BOARD_PADDING, boardSize.width - CARD_WIDTH - BOARD_PADDING),
	y: clamp(position.y, BOARD_PADDING, boardSize.height - CARD_HEIGHT - BOARD_PADDING),
});

export { clampCardPosition };
