import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/card-board.constant";
import { type CardPosition } from "../../types/card.type";

const NO_OVERLAP = 0;

// Area (px²) by which two equal-size card boxes overlap, or 0 when they merely
// touch or are apart. Used so an answer pairs only once it actually intersects
// an equation — and with whichever equation it covers most.
const cardOverlapArea = (a: CardPosition, b: CardPosition): number => {
	const overlapX = Math.max(NO_OVERLAP, CARD_WIDTH - Math.abs(a.x - b.x));
	const overlapY = Math.max(NO_OVERLAP, CARD_HEIGHT - Math.abs(a.y - b.y));

	return overlapX * overlapY;
};

export { cardOverlapArea };
