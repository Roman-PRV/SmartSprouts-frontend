import { FIRST_INDEX } from "~/libs/constants/constants";
import { type Point } from "~/libs/types/types";

const MIN_RING_VERTICES = 3;
const PREVIOUS_INDEX_OFFSET = 1;
const COLLINEAR = 0;

type Segment = readonly [Point, Point];

const orientation = (from: Point, to: Point, query: Point): number => {
	const [fromX, fromY] = from;
	const [toX, toY] = to;
	const [queryX, queryY] = query;

	return (toX - fromX) * (queryY - fromY) - (toY - fromY) * (queryX - fromX);
};

const segmentsIntersect = (segmentA: Segment, segmentB: Segment): boolean => {
	const [startA, endA] = segmentA;
	const [startB, endB] = segmentB;

	const directionA1 = orientation(startA, endA, startB);
	const directionA2 = orientation(startA, endA, endB);
	const directionB1 = orientation(startB, endB, startA);
	const directionB2 = orientation(startB, endB, endA);

	const aStraddlesB =
		(directionA1 > COLLINEAR && directionA2 < COLLINEAR) ||
		(directionA1 < COLLINEAR && directionA2 > COLLINEAR);
	const bStraddlesA =
		(directionB1 > COLLINEAR && directionB2 < COLLINEAR) ||
		(directionB1 < COLLINEAR && directionB2 > COLLINEAR);

	return aStraddlesB && bStraddlesA;
};

/** Returns true if the segment crosses any polygon edge. Collinear and vertex-touching cases return false. */
const segmentCrossesPolygon = (
	segmentStart: Point,
	segmentEnd: Point,
	polygon: Point[]
): boolean => {
	if (polygon.length < MIN_RING_VERTICES) {
		return false;
	}

	const segment: Segment = [segmentStart, segmentEnd];

	for (
		let currentIndex = FIRST_INDEX,
			previousIndex = polygon.length - PREVIOUS_INDEX_OFFSET;
		currentIndex < polygon.length;
		previousIndex = currentIndex, currentIndex++
	) {
		const current = polygon[currentIndex];
		const previous = polygon[previousIndex];

		if (current === undefined || previous === undefined) {
			continue;
		}

		if (segmentsIntersect(segment, [previous, current])) {
			return true;
		}
	}

	return false;
};

export { segmentCrossesPolygon };
