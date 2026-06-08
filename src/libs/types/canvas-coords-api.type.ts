import type { Point } from "./point.type";

type CanvasCoordsApi = {
	toNormalized: (pixel: Point) => Point;
	toPixel: (normalized: Point) => Point;
};

export type { CanvasCoordsApi };
