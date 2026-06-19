import { useMemo } from "react";

import { EMPTY_DIMENSION } from "~/libs/constants/constants";
import { type ImageDimensions, type StageSize } from "~/libs/types/types";

const useFitStageSize = (container: StageSize, image: ImageDimensions): StageSize => {
	const { height: containerHeight, width: containerWidth } = container;
	const { height: imageHeight, width: imageWidth } = image;

	return useMemo<StageSize>(() => {
		if (
			imageWidth <= EMPTY_DIMENSION ||
			imageHeight <= EMPTY_DIMENSION ||
			containerWidth <= EMPTY_DIMENSION ||
			containerHeight <= EMPTY_DIMENSION
		) {
			return { height: EMPTY_DIMENSION, width: EMPTY_DIMENSION };
		}

		const imageAspectRatio = imageWidth / imageHeight;
		const containerAspectRatio = containerWidth / containerHeight;

		if (containerAspectRatio > imageAspectRatio) {
			return { height: containerHeight, width: containerHeight * imageAspectRatio };
		}

		return { height: containerWidth / imageAspectRatio, width: containerWidth };
	}, [containerHeight, containerWidth, imageHeight, imageWidth]);
};

export { useFitStageSize };
