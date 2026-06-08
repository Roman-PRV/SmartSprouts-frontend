import { memo, useMemo } from "react";
import { Line } from "react-konva";

import { flattenPointsToPixels } from "~/libs/helpers/helpers";
import { type CanvasCoordsApi, type Polygon } from "~/libs/types/types";

const POLYGON_STROKE = "rgba(255, 255, 255, 0.85)";
const POLYGON_STROKE_WIDTH = 2;
const MATCHED_FILL = "rgba(0, 200, 0, 0.3)";

type Properties = {
	coords: CanvasCoordsApi;
	matched: boolean;
	polygon: Polygon;
};

const PolygonLine: React.FC<Properties> = memo(({ coords, matched, polygon }) => {
	const points = useMemo(() => flattenPointsToPixels(polygon.points, coords), [polygon, coords]);
	const fill = matched ? { fill: MATCHED_FILL } : {};

	return (
		<Line
			closed
			points={points}
			stroke={POLYGON_STROKE}
			strokeWidth={POLYGON_STROKE_WIDTH}
			{...fill}
		/>
	);
});

PolygonLine.displayName = "PolygonLine";

export { PolygonLine };
