import { FIRST_INDEX } from "~/libs/constants/constants";
import { type Point } from "~/libs/types/types";

const MIN_RING_VERTICES = 3;
const PREVIOUS_INDEX_OFFSET = 1;

/**
 * Ray-casting point-in-polygon test. Boundary behaviour (points exactly on
 * edges or vertices) is undefined — the algorithm is designed for strictly
 * interior or exterior queries.
 */
const pointInPolygon = ([pointX, pointY]: Point, polygon: Point[]): boolean => {
	if (polygon.length < MIN_RING_VERTICES) {
		return false;
	}

	let inside = false;

	for (
		let currentIndex = FIRST_INDEX, previousIndex = polygon.length - PREVIOUS_INDEX_OFFSET;
		currentIndex < polygon.length;
		previousIndex = currentIndex, currentIndex++
	) {
		const current = polygon[currentIndex];
		const previous = polygon[previousIndex];

		if (current === undefined || previous === undefined) {
			continue;
		}

		const [currentX, currentY] = current;
		const [previousX, previousY] = previous;

		const yStraddles = currentY > pointY !== previousY > pointY;

		if (!yStraddles) {
			continue;
		}

		const xIntersection =
			((previousX - currentX) * (pointY - currentY)) / (previousY - currentY) + currentX;

		if (pointX < xIntersection) {
			inside = !inside;
		}
	}

	return inside;
};

export { pointInPolygon };
