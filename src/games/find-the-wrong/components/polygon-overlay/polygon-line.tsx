import { memo, useMemo } from "react";
import { Line } from "react-konva";

import { flattenPointsToPixels } from "~/libs/helpers/helpers";
import { type CanvasCoordsApi, type Polygon } from "~/libs/types/types";

import { CANVAS_PALETTE, CANVAS_POLYGON } from "../../libs/constants/constants";

type Properties = {
	coords: CanvasCoordsApi;
	matched: boolean;
	polygon: Polygon;
};

const PolygonLine: React.FC<Properties> = memo(({ coords, matched, polygon }) => {
	const points = useMemo(() => flattenPointsToPixels(polygon.points, coords), [polygon, coords]);

	return (
		<Line
			closed
			points={points}
			stroke={CANVAS_PALETTE.PLAYER_STROKE}
			strokeWidth={CANVAS_POLYGON.STROKE_WIDTH_DEFAULT}
			{...(matched ? { fill: CANVAS_PALETTE.MATCHED_FILL } : {})}
		/>
	);
});

PolygonLine.displayName = "PolygonLine";

export { PolygonLine };
