import { memo, useMemo } from "react";
import { Line } from "react-konva";

import { flattenPointsToPixels } from "~/libs/helpers/helpers";
import { type CanvasCoordsApi, type Stroke } from "~/libs/types/types";

const STROKE_COLOR = "rgba(220, 38, 38, 0.95)";
const STROKE_WIDTH = 4;
const STROKE_TENSION = 0.3;

type Properties = {
	coords: CanvasCoordsApi;
	stroke: Stroke;
};

const StrokeLine: React.FC<Properties> = memo(({ coords, stroke }) => {
	const points = useMemo(() => flattenPointsToPixels(stroke.points, coords), [stroke, coords]);

	return (
		<Line
			lineCap="round"
			lineJoin="round"
			points={points}
			stroke={STROKE_COLOR}
			strokeWidth={STROKE_WIDTH}
			tension={STROKE_TENSION}
		/>
	);
});

StrokeLine.displayName = "StrokeLine";

export { StrokeLine };
