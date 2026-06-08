import { useMemo } from "react";

import { EMPTY_DIMENSION } from "~/libs/constants/constants";
import { type CanvasCoordsApi, type Point, type StageSize } from "~/libs/types/types";

const useNormalizedCoords = (stageSize: StageSize): CanvasCoordsApi => {
	return useMemo<CanvasCoordsApi>(() => {
		const { height, width } = stageSize;

		const toNormalized = ([pixelX, pixelY]: Point): Point => {
			if (width <= EMPTY_DIMENSION || height <= EMPTY_DIMENSION) {
				return [EMPTY_DIMENSION, EMPTY_DIMENSION];
			}

			return [pixelX / width, pixelY / height];
		};

		const toPixel = ([normalizedX, normalizedY]: Point): Point => [
			normalizedX * width,
			normalizedY * height,
		];

		return { toNormalized, toPixel };
	}, [stageSize]);
};

export { useNormalizedCoords };
