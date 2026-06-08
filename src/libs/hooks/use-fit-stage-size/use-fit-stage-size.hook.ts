import { useMemo } from "react";

import { EMPTY_DIMENSION } from "~/libs/constants/constants";
import { type ImageDimensions, type StageSize } from "~/libs/types/types";

const useFitStageSize = (container: StageSize, image: ImageDimensions): StageSize => {
	return useMemo<StageSize>(() => {
		if (
			image.width <= EMPTY_DIMENSION ||
			image.height <= EMPTY_DIMENSION ||
			container.width <= EMPTY_DIMENSION ||
			container.height <= EMPTY_DIMENSION
		) {
			return { height: EMPTY_DIMENSION, width: EMPTY_DIMENSION };
		}

		const imageAspectRatio = image.width / image.height;
		const containerAspectRatio = container.width / container.height;

		if (containerAspectRatio > imageAspectRatio) {
			const height = container.height;

			return { height, width: height * imageAspectRatio };
		}

		const width = container.width;

		return { height: width / imageAspectRatio, width };
	}, [container, image]);
};

export { useFitStageSize };
