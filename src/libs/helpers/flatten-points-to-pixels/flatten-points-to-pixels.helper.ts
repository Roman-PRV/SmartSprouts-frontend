import { type CanvasCoordsApi, type Point } from "~/libs/types/types";

const flattenPointsToPixels = (points: Point[], coords: CanvasCoordsApi): number[] =>
	points.flatMap((point) => {
		const [x, y] = coords.toPixel(point);

		return [x, y];
	});

export { flattenPointsToPixels };
