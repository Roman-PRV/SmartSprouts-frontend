import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import {
	pointInPolygon,
	polygonIoU,
	segmentCrossesPolygon,
} from "~/libs/helpers/helpers";
import { type Point, type Stroke } from "~/libs/types/types";

import {
	IOU_THREE_STARS,
	IOU_TWO_STARS,
	MIN_STROKE_POINTS_FOR_IOU,
} from "../../constants/constants";
import {
	type MatchableItem,
	type MatchedItem,
	type MatchResult,
} from "../../types/types";

const ZERO_IOU = 0;
const NEXT_POINT_OFFSET = 1;
const MIN_STARS = 1;
const TWO_STARS = 2;
const THREE_STARS = 3;

const strokeHitsPolygon = (stroke: Stroke, polygon: Point[]): boolean => {
	for (const point of stroke.points) {
		if (pointInPolygon(point, polygon)) {
			return true;
		}
	}

	for (let index = 0; index + NEXT_POINT_OFFSET < stroke.points.length; index++) {
		const current = stroke.points[index];
		const next = stroke.points[index + NEXT_POINT_OFFSET];

		if (current === undefined || next === undefined) {
			continue;
		}

		if (segmentCrossesPolygon(current, next, polygon)) {
			return true;
		}
	}

	return false;
};

const starsForIoU = (iou: number): number => {
	if (iou >= IOU_THREE_STARS) {
		return THREE_STARS;
	}

	if (iou >= IOU_TWO_STARS) {
		return TWO_STARS;
	}

	return MIN_STARS;
};

const findBestIoU = (hittingStrokes: Stroke[], polygon: Point[]): number => {
	let best = ZERO_IOU;

	for (const stroke of hittingStrokes) {
		if (stroke.points.length < MIN_STROKE_POINTS_FOR_IOU) {
			continue;
		}

		const iou = polygonIoU(stroke.points, polygon);

		if (iou > best) {
			best = iou;
		}
	}

	return best;
};

const bestMatchForItem = (strokes: Stroke[], item: MatchableItem): MatchedItem | null => {
	const hittingStrokes = strokes.filter((stroke) => strokeHitsPolygon(stroke, item.polygon));

	if (hittingStrokes.length === EMPTY_ARRAY_LENGTH) {
		return null;
	}

	const iou = findBestIoU(hittingStrokes, item.polygon);

	return {
		iou,
		itemId: item.id,
		stars: starsForIoU(iou),
	};
};

/** Maps each item to the best-matching stroke and assigns a star rating via IoU. */
const matchStrokesToItems = (strokes: Stroke[], items: MatchableItem[]): MatchResult => {
	const found: MatchedItem[] = [];
	const missedItemIds: number[] = [];

	for (const item of items) {
		const matched = bestMatchForItem(strokes, item);

		if (matched === null) {
			missedItemIds.push(item.id);
		} else {
			found.push(matched);
		}
	}

	return { found, missedItemIds };
};

export { matchStrokesToItems };
