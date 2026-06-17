import { polygonIoU } from "~/libs/helpers/helpers";
import { type Point, type Stroke } from "~/libs/types/types";

import {
	IOU_FOUND_THRESHOLD,
	IOU_THREE_STARS,
	IOU_TWO_STARS,
	MIN_STROKE_POINTS_FOR_IOU,
} from "../../constants/constants";
import { type MatchableItem, type MatchedItem, type MatchResult } from "../../types/types";
import { isClosedLoop } from "../is-closed-loop/is-closed-loop.helper";

const ZERO_IOU = 0;
const ONE_STAR = 1;
const TWO_STARS = 2;
const THREE_STARS = 3;

const starsForIoU = (iou: number): number => {
	if (iou >= IOU_THREE_STARS) {
		return THREE_STARS;
	}

	if (iou >= IOU_TWO_STARS) {
		return TWO_STARS;
	}

	return ONE_STAR;
};

/**
 * A stroke can score only if it has enough points to enclose area and forms a
 * closed loop. This is stroke-intrinsic, so it is filtered once per attempt
 * rather than re-checked for every item.
 */
const isValidLoop = (stroke: Stroke): boolean =>
	stroke.points.length >= MIN_STROKE_POINTS_FOR_IOU && isClosedLoop(stroke.points);

/** Best area-overlap (IoU) between any pre-validated loop and the item polygon. */
const bestStrokeIoU = (loops: Stroke[], polygon: Point[]): number => {
	let best = ZERO_IOU;

	for (const loop of loops) {
		const iou = polygonIoU(loop.points, polygon);

		if (iou > best) {
			best = iou;
		}
	}

	return best;
};

/**
 * Matches each item by how well a drawn loop encloses it (area IoU), not by
 * whether the pen merely touched it. An item is "found" only when the best
 * stroke's IoU clears `IOU_FOUND_THRESHOLD`; this rejects open scribbles
 * (near-zero area) and catch-all loops around the whole image (tiny IoU vs a
 * huge union), while a tight circle earns more stars.
 */
const matchStrokesToItems = (strokes: Stroke[], items: MatchableItem[]): MatchResult => {
	const found: MatchedItem[] = [];
	const missedItemIds: number[] = [];
	const loops = strokes.filter((stroke) => isValidLoop(stroke));

	for (const item of items) {
		const iou = bestStrokeIoU(loops, item.polygon);

		if (iou >= IOU_FOUND_THRESHOLD) {
			found.push({ iou, itemId: item.id, stars: starsForIoU(iou) });
		} else {
			missedItemIds.push(item.id);
		}
	}

	return { found, missedItemIds };
};

export { matchStrokesToItems };
