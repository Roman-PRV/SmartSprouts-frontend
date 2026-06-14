import { polygonIoU } from "~/libs/helpers/helpers";
import { type Point, type Stroke } from "~/libs/types/types";

import {
	CLOSURE_GAP_RATIO,
	IOU_FOUND_THRESHOLD,
	IOU_THREE_STARS,
	IOU_TWO_STARS,
	MIN_STROKE_POINTS_FOR_IOU,
} from "../../constants/constants";
import { type MatchableItem, type MatchedItem, type MatchResult } from "../../types/types";

const FIRST_POINT_INDEX = 0;
const LAST_POINT_OFFSET = 1;
const X = 0;
const Y = 1;
const ZERO_IOU = 0;
const ZERO_LENGTH = 0;
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
 * A stroke is a closed loop when its endpoints meet up: the gap between the
 * first and last point is at most `CLOSURE_GAP_RATIO` of the stroke's
 * bounding-box diagonal. Open lines and arcs (endpoints far apart) fail this,
 * so auto-closing them into a spurious area polygon can't produce a match.
 */
const isClosedLoop = (points: Point[]): boolean => {
	const first = points[FIRST_POINT_INDEX];
	const last = points[points.length - LAST_POINT_OFFSET];

	if (!first || !last) {
		return false;
	}

	let minX = first[X];
	let minY = first[Y];
	let maxX = first[X];
	let maxY = first[Y];

	for (const [x, y] of points) {
		minX = Math.min(minX, x);
		minY = Math.min(minY, y);
		maxX = Math.max(maxX, x);
		maxY = Math.max(maxY, y);
	}

	const diagonal = Math.hypot(maxX - minX, maxY - minY);

	if (diagonal <= ZERO_LENGTH) {
		return false;
	}

	const gap = Math.hypot(last[X] - first[X], last[Y] - first[Y]);

	return gap <= CLOSURE_GAP_RATIO * diagonal;
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
