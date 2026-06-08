import { describe, expect, it } from "vitest";

import { flattenPointsToPixels } from "~/libs/helpers/flatten-points-to-pixels/flatten-points-to-pixels.helper";
import { type CanvasCoordsApi, type Point } from "~/libs/types/types";

const STAGE_WIDTH = 800;
const STAGE_HEIGHT = 400;

const buildCoords = (): CanvasCoordsApi => ({
	toNormalized: ([pixelX, pixelY]) => [pixelX / STAGE_WIDTH, pixelY / STAGE_HEIGHT],
	toPixel: ([normalizedX, normalizedY]) => [normalizedX * STAGE_WIDTH, normalizedY * STAGE_HEIGHT],
});

describe("flattenPointsToPixels", () => {
	it("returns an empty array for an empty point list", () => {
		expect(flattenPointsToPixels([], buildCoords())).toEqual([]);
	});

	it("maps a single normalised point to its pixel coordinates flattened", () => {
		const point: Point = [0.5, 0.25];

		expect(flattenPointsToPixels([point], buildCoords())).toEqual([400, 100]);
	});

	it("preserves point order and flattens xy pairs sequentially", () => {
		const points: Point[] = [
			[0, 0],
			[0.5, 0.5],
			[1, 1],
		];

		expect(flattenPointsToPixels(points, buildCoords())).toEqual([
			0, 0, 400, 200, 800, 400,
		]);
	});
});
