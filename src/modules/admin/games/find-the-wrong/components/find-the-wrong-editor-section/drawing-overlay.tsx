import { type KonvaEventObject } from "konva/lib/Node";
import { Circle, Line, Rect } from "react-konva";

import {
	CANVAS_HANDLE,
	CANVAS_PALETTE,
	CANVAS_POLYGON,
} from "~/games/find-the-wrong/find-the-wrong";
import { clamp01, flattenPointsToPixels, getStagePointer } from "~/libs/helpers/helpers";
import { useCallback } from "~/libs/hooks/hooks";
import { type CanvasCoordsApi, type Point } from "~/libs/types/types";

const NORMALIZED_BOUND = 1;
const NO_VERTICES = 0;

type Properties = {
	coords: CanvasCoordsApi;
	onAddVertex: (point: Point) => void;
	vertices: Point[];
};

const DrawingOverlay: React.FC<Properties> = ({ coords, onAddVertex, vertices }) => {
	const [stageWidth, stageHeight] = coords.toPixel([NORMALIZED_BOUND, NORMALIZED_BOUND]);
	const flatPoints = flattenPointsToPixels(vertices, coords);

	const handleStageClick = useCallback(
		(event: KonvaEventObject<MouseEvent>) => {
			const pixel = getStagePointer(event);

			if (!pixel) {
				return;
			}

			const [normalizedX, normalizedY] = coords.toNormalized(pixel);

			onAddVertex([clamp01(normalizedX), clamp01(normalizedY)]);
		},
		[coords, onAddVertex]
	);

	return (
		<>
			<Rect
				fill={CANVAS_PALETTE.TRANSPARENT}
				height={stageHeight}
				onClick={handleStageClick}
				width={stageWidth}
				x={0}
				y={0}
			/>
			{vertices.length > NO_VERTICES && (
				<Line
					points={flatPoints}
					stroke={CANVAS_PALETTE.DRAWING_STROKE}
					strokeWidth={CANVAS_POLYGON.STROKE_WIDTH_DEFAULT}
				/>
			)}
			{vertices.map((vertex, index) => {
				const [pixelX, pixelY] = coords.toPixel(vertex);

				return (
					<Circle
						fill={CANVAS_PALETTE.DRAWING_STROKE}
						key={`drawing-vertex-${String(index)}`}
						radius={CANVAS_HANDLE.RADIUS}
						stroke={CANVAS_HANDLE.STROKE}
						strokeWidth={CANVAS_HANDLE.STROKE_WIDTH}
						x={pixelX}
						y={pixelY}
					/>
				);
			})}
		</>
	);
};

export { DrawingOverlay };
