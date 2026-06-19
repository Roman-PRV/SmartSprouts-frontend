import { useMemo } from "react";
import { Line } from "react-konva";

import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { flattenPointsToPixels } from "~/libs/helpers/helpers";
import { type CanvasCoordsApi, type Point } from "~/libs/types/types";

const STROKE_COLOR = "rgba(220, 38, 38, 0.95)";
const STROKE_WIDTH = 4;
const STROKE_TENSION = 0.3;

type Properties = {
	coords: CanvasCoordsApi;
	points: Point[];
};

const InFlightStrokeLine: React.FC<Properties> = ({ coords, points }) => {
	const flat = useMemo(() => flattenPointsToPixels(points, coords), [points, coords]);

	if (points.length === EMPTY_ARRAY_LENGTH) {
		return null;
	}

	return (
		<Line
			lineCap="round"
			lineJoin="round"
			points={flat}
			stroke={STROKE_COLOR}
			strokeWidth={STROKE_WIDTH}
			tension={STROKE_TENSION}
		/>
	);
};

export { InFlightStrokeLine };
