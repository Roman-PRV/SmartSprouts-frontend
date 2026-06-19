import { type Point } from "~/libs/types/types";

import { CLOSURE_GAP_RATIO } from "../../constants/constants";

const FIRST_POINT_INDEX = 0;
const LAST_POINT_OFFSET = 1;
const X = 0;
const Y = 1;
const ZERO_LENGTH = 0;

/**
 * A stroke is a closed loop when its endpoints meet up: the gap between the
 * first and last point is at most CLOSURE_GAP_RATIO of the stroke's bounding-box
 * diagonal. Open lines and arcs (endpoints far apart) fail this. Shared by the
 * match engine (scoring gate) and the player renderer, so what *looks* closed is
 * exactly what scores.
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

export { isClosedLoop };
