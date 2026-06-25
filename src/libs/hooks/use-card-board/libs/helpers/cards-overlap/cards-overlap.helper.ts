import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/card-board.constant";
import { type CardPosition } from "../../types/card.type";

// True when `position`'s box strictly overlaps any of the others. Touching edges
// (a glued pair) does not count — only real cover-up. Used to bounce a card back
// home when it is dropped on top of another.
const cardsOverlap = (position: CardPosition, others: CardPosition[]): boolean =>
	others.some(
		(other) =>
			Math.abs(position.x - other.x) < CARD_WIDTH && Math.abs(position.y - other.y) < CARD_HEIGHT
	);

export { cardsOverlap };
