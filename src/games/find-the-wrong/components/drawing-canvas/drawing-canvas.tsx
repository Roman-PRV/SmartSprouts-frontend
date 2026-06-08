import { type KonvaEventObject } from "konva/lib/Node";
import { Image as KonvaImage, Layer, Stage } from "react-konva";
import useImage from "use-image";

import { EMPTY_DIMENSION } from "~/libs/constants/constants";
import { clamp01 } from "~/libs/helpers/helpers";
import {
	useCallback,
	useContainerSize,
	useFitStageSize,
	useMemo,
	useNormalizedCoords,
	usePointerDrawing,
} from "~/libs/hooks/hooks";
import {
	type CanvasCoordsApi,
	type ImageDimensions,
	type Point,
	type Polygon,
	type Stroke,
} from "~/libs/types/types";

import { type FeedbackOverlay } from "../../libs/types/types";
import { PolygonOverlay } from "../polygon-overlay/polygon-overlay";
import { InFlightStrokeLine } from "../stroke-layer/in-flight-stroke-line";
import { StrokeLayer } from "../stroke-layer/stroke-layer";
import styles from "./styles.module.css";

type CommonProperties = {
	imageUrl: string;
	polygons: Polygon[];
	strokes: Stroke[];
};

type EditorProperties = CommonProperties & {
	editorSlot?: (api: CanvasCoordsApi) => React.ReactNode;
	feedbackOverlay?: never;
	mode: "editor";
	onStrokeComplete?: never;
};

type PlayerProperties = CommonProperties & {
	editorSlot?: never;
	feedbackOverlay?: FeedbackOverlay[];
	mode: "player";
	onStrokeComplete?: (points: Point[]) => void;
};

type Properties = EditorProperties | PlayerProperties;

const getPointerPoint = (event: KonvaEventObject<PointerEvent>): null | Point => {
	const position = event.target.getStage()?.getPointerPosition();

	if (!position) {
		return null;
	}

	return [position.x, position.y];
};

const DrawingCanvas: React.FC<Properties> = (properties) => {
	const { imageUrl, polygons, strokes } = properties;
	const isPlayerMode = properties.mode === "player";

	const { containerReference, size: containerSize } = useContainerSize<HTMLDivElement>();
	const [image, imageStatus] = useImage(imageUrl);

	const imageDimensions = useMemo<ImageDimensions>(() => {
		if (!image) {
			return { height: EMPTY_DIMENSION, width: EMPTY_DIMENSION };
		}

		return { height: image.naturalHeight, width: image.naturalWidth };
	}, [image]);

	const stageSize = useFitStageSize(containerSize, imageDimensions);
	const coords = useNormalizedCoords(stageSize);

	const toClampedNormalized = useCallback(
		(pixel: Point): Point => {
			const [normalizedX, normalizedY] = coords.toNormalized(pixel);

			return [clamp01(normalizedX), clamp01(normalizedY)];
		},
		[coords]
	);

	const playerStrokeHandler = isPlayerMode ? properties.onStrokeComplete : undefined;
	const drawing = usePointerDrawing(toClampedNormalized, isPlayerMode, playerStrokeHandler);

	const handlePointerDown = useCallback(
		(event: KonvaEventObject<PointerEvent>): void => {
			const point = getPointerPoint(event);

			if (point) {
				drawing.handlers.onStart(point);
			}
		},
		[drawing.handlers]
	);

	const handlePointerMove = useCallback(
		(event: KonvaEventObject<PointerEvent>): void => {
			const point = getPointerPoint(event);

			if (point) {
				drawing.handlers.onMove(point);
			}
		},
		[drawing.handlers]
	);

	const playerFeedback = isPlayerMode ? properties.feedbackOverlay : undefined;
	const editorSlot = properties.mode === "editor" ? properties.editorSlot : undefined;
	const showPolygons = isPlayerMode && playerFeedback !== undefined;
	const hasStageDimensions =
		stageSize.width > EMPTY_DIMENSION && stageSize.height > EMPTY_DIMENSION;

	if (!image || imageStatus !== "loaded" || !hasStageDimensions) {
		return <div className={styles["container"]} ref={containerReference} />;
	}

	return (
		<div className={styles["container"]} ref={containerReference}>
			<Stage
				height={stageSize.height}
				onPointerCancel={drawing.handlers.onCancel}
				onPointerDown={handlePointerDown}
				onPointerLeave={drawing.handlers.onCancel}
				onPointerMove={handlePointerMove}
				onPointerUp={drawing.handlers.onEnd}
				width={stageSize.width}
			>
				<Layer>
					<KonvaImage height={stageSize.height} image={image} width={stageSize.width} />
				</Layer>
				{showPolygons ? (
					<Layer listening={false}>
						<PolygonOverlay
							coords={coords}
							feedbackOverlay={playerFeedback}
							polygons={polygons}
						/>
					</Layer>
				) : null}
				<Layer listening={false}>
					<StrokeLayer coords={coords} strokes={strokes} />
					<InFlightStrokeLine coords={coords} points={drawing.inFlightPoints} />
				</Layer>
				{editorSlot ? <Layer>{editorSlot(coords)}</Layer> : null}
			</Stage>
		</div>
	);
};

export { DrawingCanvas };
