import { type CardPosition, type EquationCard } from "../../types/card.type";
import { cardOverlapArea } from "../card-overlap-area/card-overlap-area.helper";

type FindOverlappingFreeEquationParameters = {
	answerPosition: CardPosition;
	equationCards: EquationCard[];
	pairs: Record<string, null | string>;
	positions: Record<string, CardPosition>;
};

const NO_OVERLAP = 0;

// The free (unpaired) equation the dropped answer overlaps most, or null when it
// overlaps none. Pairing happens only on a real intersection — not on mere
// proximity — so the answer must be dragged onto the equation to snap.
const findOverlappingFreeEquation = ({
	answerPosition,
	equationCards,
	pairs,
	positions,
}: FindOverlappingFreeEquationParameters): null | string => {
	let bestKey: null | string = null;
	let bestArea = NO_OVERLAP;

	for (const card of equationCards) {
		const isFree = pairs[card.key] === null;
		const equationPosition = positions[card.key];

		if (!isFree || equationPosition === undefined) {
			continue;
		}

		const area = cardOverlapArea(answerPosition, equationPosition);

		if (area > bestArea) {
			bestArea = area;
			bestKey = card.key;
		}
	}

	return bestKey;
};

export { findOverlappingFreeEquation };
