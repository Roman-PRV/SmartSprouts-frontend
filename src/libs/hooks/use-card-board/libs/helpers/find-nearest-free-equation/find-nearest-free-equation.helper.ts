import { type CardPosition, type EquationCard } from "../../types/card.type";
import { distanceBetween } from "../distance-between/distance-between.helper";

type FindNearestFreeEquationParameters = {
	answerPosition: CardPosition;
	equationCards: EquationCard[];
	pairs: Record<string, null | string>;
	positions: Record<string, CardPosition>;
	threshold: number;
};

// Closest equation that is still free (unpaired) and within `threshold` of the
// dropped answer, or null when none qualifies. Seeding the running minimum with
// the threshold makes "within range" and "nearest" a single pass.
const findNearestFreeEquation = ({
	answerPosition,
	equationCards,
	pairs,
	positions,
	threshold,
}: FindNearestFreeEquationParameters): null | string => {
	let nearestKey: null | string = null;
	let nearestDistance = threshold;

	for (const card of equationCards) {
		const isFree = pairs[card.key] === null;
		const equationPosition = positions[card.key];

		if (!isFree || equationPosition === undefined) {
			continue;
		}

		const distance = distanceBetween(answerPosition, equationPosition);

		if (distance < nearestDistance) {
			nearestDistance = distance;
			nearestKey = card.key;
		}
	}

	return nearestKey;
};

export { findNearestFreeEquation };
