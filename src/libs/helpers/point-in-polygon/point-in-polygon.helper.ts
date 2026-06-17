import { type Point } from "~/libs/types/types";

const MIN_POLYGON_VERTICES = 3;
const X = 0;
const Y = 1;
const FIRST_INDEX = 0;
const PREVIOUS_OFFSET = 1;

/**
 * Ray-casting test: returns true when `point` lies inside `polygon`. Both must be
 * in the same coordinate space (normalized [0,1] here). Boundary hits are not
 * guaranteed either way — irrelevant for tap hit-testing against freehand item
 * polygons.
 */
const pointInPolygon = (point: Point, polygon: Point[]): boolean => {
	if (polygon.length < MIN_POLYGON_VERTICES) {
		return false;
	}

	const px = point[X];
	const py = point[Y];
	let inside = false;

	for (
		let current = FIRST_INDEX, previous = polygon.length - PREVIOUS_OFFSET;
		current < polygon.length;
		previous = current, current++
	) {
		const a = polygon[current];
		const b = polygon[previous];

		if (a === undefined || b === undefined) {
			continue;
		}

		const crossesRay =
			a[Y] > py !== b[Y] > py &&
			px < ((b[X] - a[X]) * (py - a[Y])) / (b[Y] - a[Y]) + a[X];

		if (crossesRay) {
			inside = !inside;
		}
	}

	return inside;
};

export { pointInPolygon };
