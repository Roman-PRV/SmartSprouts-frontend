import polygonClipping, {
	type MultiPolygon as ClippingMultiPolygon,
	type Pair as ClippingPair,
	type Ring as ClippingRing,
} from "polygon-clipping";

import { FIRST_INDEX } from "~/libs/constants/constants";
import { clamp01 } from "~/libs/helpers/helpers";
import { type Point } from "~/libs/types/types";

const MIN_RING_VERTICES = 3;
const PREVIOUS_INDEX_OFFSET = 1;
const EMPTY_AREA = 0;
const SHOELACE_DIVISOR = 2;
const OUTER_RING_INDEX = 0;
const ZERO_IOU = 0;

const toClippingRing = (polygon: Point[]): ClippingRing =>
	polygon.map(([x, y]): ClippingPair => [x, y]);

const ringArea = (ring: ClippingRing): number => {
	let area = EMPTY_AREA;

	for (
		let currentIndex = FIRST_INDEX,
			previousIndex = ring.length - PREVIOUS_INDEX_OFFSET;
		currentIndex < ring.length;
		previousIndex = currentIndex, currentIndex++
	) {
		const current = ring[currentIndex];
		const previous = ring[previousIndex];

		if (current === undefined || previous === undefined) {
			continue;
		}

		const [previousX, previousY] = previous;
		const [currentX, currentY] = current;

		area += (previousX + currentX) * (previousY - currentY);
	}

	return Math.abs(area) / SHOELACE_DIVISOR;
};

const multiPolygonArea = (multi: ClippingMultiPolygon): number => {
	let total = EMPTY_AREA;

	for (const polygon of multi) {
		for (const [ringIndex, ring] of polygon.entries()) {
			const area = ringArea(ring);

			total += ringIndex === OUTER_RING_INDEX ? area : -area;
		}
	}

	return total;
};

/** Computes Intersection-over-Union for two arbitrary polygons; returns a value in [0, 1]. */
const polygonIoU = (polygonA: Point[], polygonB: Point[]): number => {
	if (polygonA.length < MIN_RING_VERTICES || polygonB.length < MIN_RING_VERTICES) {
		return ZERO_IOU;
	}

	const ringA = toClippingRing(polygonA);
	const ringB = toClippingRing(polygonB);

	const intersectionArea = multiPolygonArea(polygonClipping.intersection([[ringA]], [[ringB]]));

	// inclusion-exclusion: area(A ∪ B) = area(A) + area(B) − area(A ∩ B)
	const areaA = ringArea(ringA);
	const areaB = ringArea(ringB);
	const unionArea = areaA + areaB - intersectionArea;

	if (unionArea <= EMPTY_AREA) {
		return ZERO_IOU;
	}

	return clamp01(intersectionArea / unionArea);
};

export { polygonIoU };
