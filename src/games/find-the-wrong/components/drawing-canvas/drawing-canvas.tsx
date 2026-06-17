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
	useTapDetection,
} from "~/libs/hooks/hooks";
import {
	type CanvasCoordsApi,
	type ImageDimensions,
	type Point,
	type Polygon,
	type Stroke,
} from "~/libs/types/types";

import { type FeedbackOverlay, type Marker } from "../../libs/types/types";
import { MarkerLayer } from "../marker-layer/marker-layer";
import { PolygonOverlay } from "../polygon-overlay/polygon-overlay";
import { InFlightStrokeLine } from "../stroke-layer/in-flight-stroke-line";
import { StrokeLayer } from "../stroke-layer/stroke-layer";
import styles from "./styles.module.css";

const NO_STROKES: Stroke[] = [];
const NO_MARKERS: Marker[] = [];

type CommonProperties = {
	imageUrl: string;
	polygons: Polygon[];
};

// `never` guards forbid wiring an interaction prop that does nothing in the
// given mode (e.g. an editor receiving onStrokeComplete) — a silent no-op
// otherwise, since a union allows any member's prop through excess-prop checks.
type EditorProperties = CommonProperties & {
	editorSlot?: (api: CanvasCoordsApi) => React.ReactNode;
	mode: "editor";
	onMarkerToggle?: never;
	onStrokeComplete?: never;
	strokes: Stroke[];
};

type MarkerProperties = CommonProperties & {
	editorSlot?: never;
	feedbackOverlay?: FeedbackOverlay[];
	markers: Marker[];
	mode: "marker";
	onMarkerToggle?: (point: Point) => void;
	onStrokeComplete?: never;
};

type PlayerProperties = CommonProperties & {
	editorSlot?: never;
	feedbackOverlay?: FeedbackOverlay[];
	mode: "player";
	onMarkerToggle?: never;
	onStrokeComplete?: (points: Point[]) => void;
	strokes: Stroke[];
};

type Properties = EditorProperties | MarkerProperties | PlayerProperties;

const getPointerPoint = (event: KonvaEventObject<PointerEvent>): null | Point => {
	const position = event.target.getStage()?.getPointerPosition();

	if (!position) {
		return null;
	}

	return [position.x, position.y];
};

const DrawingCanvas: React.FC<Properties> = (properties) => {
	const { imageUrl, polygons } = properties;
	const isPlayerMode = properties.mode === "player";
	const isMarkerMode = properties.mode === "marker";

	const strokes = properties.mode === "marker" ? NO_STROKES : properties.strokes;
	const markers = properties.mode === "marker" ? properties.markers : NO_MARKERS;
	const onMarkerToggle = properties.mode === "marker" ? properties.onMarkerToggle : undefined;

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
	const tap = useTapDetection(toClampedNormalized, isMarkerMode, onMarkerToggle);

	// Both hooks expose an identical handler shape, so the canvas just delegates
	// pointer events to the active interaction without per-event mode branching.
	const interaction = isMarkerMode ? tap : drawing;

	const handlePointerDown = useCallback(
		(event: KonvaEventObject<PointerEvent>): void => {
			const point = getPointerPoint(event);

			if (point) {
				interaction.handlers.onStart(point);
			}
		},
		[interaction.handlers]
	);

	const handlePointerMove = useCallback(
		(event: KonvaEventObject<PointerEvent>): void => {
			const point = getPointerPoint(event);

			if (point) {
				interaction.handlers.onMove(point);
			}
		},
		[interaction.handlers]
	);

	const handlePointerUp = useCallback((): void => {
		interaction.handlers.onEnd();
	}, [interaction.handlers]);

	const handlePointerCancel = useCallback((): void => {
		interaction.handlers.onCancel();
	}, [interaction.handlers]);

	const playerFeedback =
		properties.mode === "editor" ? undefined : properties.feedbackOverlay;
	const editorSlot = properties.mode === "editor" ? properties.editorSlot : undefined;
	const showPolygons = playerFeedback !== undefined;
	const hasStageDimensions =
		stageSize.width > EMPTY_DIMENSION && stageSize.height > EMPTY_DIMENSION;

	if (!image || imageStatus !== "loaded" || !hasStageDimensions) {
		return <div className={styles["container"]} ref={containerReference} />;
	}

	return (
		<div className={styles["container"]} ref={containerReference}>
			<Stage
				height={stageSize.height}
				onPointerCancel={handlePointerCancel}
				onPointerDown={handlePointerDown}
				onPointerLeave={handlePointerCancel}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
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
					{isMarkerMode ? (
						<MarkerLayer coords={coords} markers={markers} />
					) : (
						<>
							<StrokeLayer coords={coords} strokes={strokes} />
							<InFlightStrokeLine coords={coords} points={drawing.inFlightPoints} />
						</>
					)}
				</Layer>
				{editorSlot ? <Layer>{editorSlot(coords)}</Layer> : null}
			</Stage>
		</div>
	);
};

export { DrawingCanvas };
