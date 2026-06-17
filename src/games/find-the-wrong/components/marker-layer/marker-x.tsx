import { memo, useMemo } from "react";
import { Line } from "react-konva";

import { flattenPointsToPixels } from "~/libs/helpers/helpers";
import { type CanvasCoordsApi } from "~/libs/types/types";

import { CANVAS_MARKER } from "../../libs/constants/constants";
import { type Marker } from "../../libs/types/types";

const CENTER_X_INDEX = 0;
const CENTER_Y_INDEX = 1;
const FALLBACK_PIXEL = 0;

type Properties = {
	coords: CanvasCoordsApi;
	marker: Marker;
};

const MarkerX: React.FC<Properties> = memo(({ coords, marker }) => {
	const pixels = useMemo(() => flattenPointsToPixels([marker.point], coords), [marker, coords]);

	const centerX = pixels[CENTER_X_INDEX] ?? FALLBACK_PIXEL;
	const centerY = pixels[CENTER_Y_INDEX] ?? FALLBACK_PIXEL;
	const half = CANVAS_MARKER.HALF_SIZE;

	return (
		<>
			<Line
				lineCap="round"
				points={[centerX - half, centerY - half, centerX + half, centerY + half]}
				stroke={CANVAS_MARKER.STROKE}
				strokeWidth={CANVAS_MARKER.STROKE_WIDTH}
			/>
			<Line
				lineCap="round"
				points={[centerX - half, centerY + half, centerX + half, centerY - half]}
				stroke={CANVAS_MARKER.STROKE}
				strokeWidth={CANVAS_MARKER.STROKE_WIDTH}
			/>
		</>
	);
});

MarkerX.displayName = "MarkerX";

export { MarkerX };
