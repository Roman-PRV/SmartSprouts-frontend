import { memo, useMemo } from "react";
import { Line } from "react-konva";

import { flattenPointsToPixels } from "~/libs/helpers/helpers";
import { type CanvasCoordsApi, type Stroke } from "~/libs/types/types";

import { isClosedLoop } from "../../libs/helpers/helpers";

const STROKE_COLOR = "rgba(220, 38, 38, 0.95)";
const CLOSED_FILL = "rgba(220, 38, 38, 0.12)";
// Muted slate for the read-only review pass, so marks read as non-interactive.
const REVIEW_COLOR = "rgba(100, 116, 139, 0.95)";
const REVIEW_FILL = "rgba(100, 116, 139, 0.14)";
const OPEN_FILL = "rgba(0, 0, 0, 0)";
const STROKE_WIDTH = 4;
const STROKE_TENSION = 0.3;

type Properties = {
	coords: CanvasCoordsApi;
	highlightClosed?: boolean;
	readOnly?: boolean;
	stroke: Stroke;
};

const StrokeLine: React.FC<Properties> = memo(
	({ coords, highlightClosed = false, readOnly = false, stroke }) => {
		const points = useMemo(() => flattenPointsToPixels(stroke.points, coords), [stroke, coords]);
		// Honest rendering: only a real closed loop is drawn closed + filled, so two
		// open arcs can't masquerade as one enclosed object. Same predicate as the
		// match engine, so what looks closed is exactly what scores.
		const isClosed = useMemo(
			() => highlightClosed && isClosedLoop(stroke.points),
			[highlightClosed, stroke]
		);

		const strokeColor = readOnly ? REVIEW_COLOR : STROKE_COLOR;
		const closedFill = readOnly ? REVIEW_FILL : CLOSED_FILL;

		return (
			<Line
				closed={isClosed}
				fill={isClosed ? closedFill : OPEN_FILL}
				lineCap="round"
				lineJoin="round"
				points={points}
				stroke={strokeColor}
				strokeWidth={STROKE_WIDTH}
				tension={STROKE_TENSION}
			/>
		);
	}
);

StrokeLine.displayName = "StrokeLine";

export { StrokeLine };
