import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { pointInPolygon } from "~/libs/helpers/helpers";

import { STAR_TIME_THREE_SECONDS, STAR_TIME_TWO_SECONDS } from "../../constants/constants";
import {
	type Marker,
	type MatchableItem,
	type MatchedItem,
	type MatchResult,
} from "../../types/types";

const MS_PER_SECOND = 1000;
const ONE_STAR = 1;
const TWO_STARS = 2;
const THREE_STARS = 3;

const starsForElapsedSeconds = (seconds: number): number => {
	if (seconds < STAR_TIME_THREE_SECONDS) {
		return THREE_STARS;
	}

	if (seconds < STAR_TIME_TWO_SECONDS) {
		return TWO_STARS;
	}

	return ONE_STAR;
};

/**
 * Matches each item by whether any tap marker falls inside its polygon
 * (point-in-polygon). Stars come from speed, not accuracy: the elapsed time from
 * level load to the EARLIEST containing tap. Items with no containing tap are
 * missed. Marker results carry no IoU — that field is circle-mode only.
 */
const matchTapsToItems = (
	markers: Marker[],
	items: MatchableItem[],
	levelStartMs: number
): MatchResult => {
	const found: MatchedItem[] = [];
	const missedItemIds: number[] = [];

	for (const item of items) {
		const containing = markers.filter((marker) => pointInPolygon(marker.point, item.polygon));

		if (containing.length === EMPTY_ARRAY_LENGTH) {
			missedItemIds.push(item.id);

			continue;
		}

		const earliestMs = Math.min(...containing.map((marker) => marker.placedAtMs));
		const elapsedSeconds = (earliestMs - levelStartMs) / MS_PER_SECOND;

		found.push({ itemId: item.id, stars: starsForElapsedSeconds(elapsedSeconds) });
	}

	return { found, missedItemIds };
};

export { matchTapsToItems };
