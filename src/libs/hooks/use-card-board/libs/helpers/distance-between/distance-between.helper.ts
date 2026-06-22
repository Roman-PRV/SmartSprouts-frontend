import { type CardPosition } from "../../types/card.type";

// Euclidean distance between two card anchors. Cards are uniform in size, so
// center distance is a faithful proxy for "how close" two cards are.
const distanceBetween = (a: CardPosition, b: CardPosition): number =>
	Math.hypot(a.x - b.x, a.y - b.y);

export { distanceBetween };
