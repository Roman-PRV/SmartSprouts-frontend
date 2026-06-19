import { type KonvaEventObject } from "konva/lib/Node";
import { Circle, Group, Line } from "react-konva";

import {
	CANVAS_HANDLE,
	CANVAS_INSERT_HANDLE,
	CANVAS_PALETTE,
	CANVAS_POLYGON,
} from "~/games/find-the-wrong/find-the-wrong";
import { clamp01, flattenPointsToPixels, getStagePointer } from "~/libs/helpers/helpers";
import { useCallback } from "~/libs/hooks/hooks";
import { type CanvasCoordsApi, type Point } from "~/libs/types/types";

import {
	insertVertexAfter,
	MIN_POLYGON_VERTICES,
	moveVertex,
	removeVertex,
} from "../../libs/helpers/polygon-mutations.helper";
import { type FindTheWrongAdminItemDto } from "../../libs/types/types";

const NEXT_OFFSET = 1;
const MIDPOINT_DIVISOR = 2;
const ICON_CENTER = 0;

type ItemOverlayProperties = {
	coords: CanvasCoordsApi;
	isActive: boolean;
	item: FindTheWrongAdminItemDto;
	onPolygonChange: (itemId: number, points: Point[]) => void;
	onSelect: (itemId: number) => void;
};

type Properties = {
	activeItemId: null | number;
	coords: CanvasCoordsApi;
	items: FindTheWrongAdminItemDto[];
	onActiveItemChange: (itemId: number) => void;
	onPolygonChange: (itemId: number, points: Point[]) => void;
};

const ItemOverlay: React.FC<ItemOverlayProperties> = ({
	coords,
	isActive,
	item,
	onPolygonChange,
	onSelect,
}) => {
	const flatPoints = flattenPointsToPixels(item.polygon, coords);

	const handleLineClick = useCallback(() => {
		onSelect(item.id);
	}, [item.id, onSelect]);

	const handleVertexDragMove = useCallback(
		(vertexIndex: number) =>
			(event: KonvaEventObject<DragEvent>): void => {
				const node = event.target;
				const [normalizedX, normalizedY] = coords.toNormalized([node.x(), node.y()]);
				const nextPoint: Point = [clamp01(normalizedX), clamp01(normalizedY)];

				onPolygonChange(item.id, moveVertex(item.polygon, vertexIndex, nextPoint));
			},
		[coords, item.id, item.polygon, onPolygonChange]
	);

	const handleVertexContextMenu = useCallback(
		(vertexIndex: number) =>
			(event: KonvaEventObject<PointerEvent>): void => {
				event.evt.preventDefault();

				const next = removeVertex(item.polygon, vertexIndex);

				if (next) {
					onPolygonChange(item.id, next);
				}
			},
		[item.id, item.polygon, onPolygonChange]
	);

	const handleEdgeMidpointClick = useCallback(
		(edgeIndex: number) =>
			(event: KonvaEventObject<MouseEvent>): void => {
				event.cancelBubble = true;

				const pixel = getStagePointer(event);

				if (!pixel) {
					return;
				}

				const [normalizedX, normalizedY] = coords.toNormalized(pixel);
				const point: Point = [clamp01(normalizedX), clamp01(normalizedY)];

				onPolygonChange(item.id, insertVertexAfter(item.polygon, edgeIndex, point));
			},
		[coords, item.id, item.polygon, onPolygonChange]
	);

	const canDeleteVertex = item.polygon.length > MIN_POLYGON_VERTICES;

	return (
		<Group>
			<Line
				closed
				{...(isActive ? { fill: CANVAS_PALETTE.ACTIVE_FILL } : {})}
				onClick={handleLineClick}
				points={flatPoints}
				stroke={isActive ? CANVAS_PALETTE.ACTIVE_STROKE : CANVAS_PALETTE.IDLE_STROKE}
				strokeWidth={
					isActive ? CANVAS_POLYGON.STROKE_WIDTH_ACTIVE : CANVAS_POLYGON.STROKE_WIDTH_DEFAULT
				}
			/>
			{isActive && (
				<>
					{item.polygon.map((point, index) => {
						const nextIndex = (index + NEXT_OFFSET) % item.polygon.length;
						const nextPoint = item.polygon[nextIndex];

						if (!nextPoint) {
							return null;
						}

						const [currentPixelX, currentPixelY] = coords.toPixel(point);
						const [nextPixelX, nextPixelY] = coords.toPixel(nextPoint);
						const midpointPixelX = (currentPixelX + nextPixelX) / MIDPOINT_DIVISOR;
						const midpointPixelY = (currentPixelY + nextPixelY) / MIDPOINT_DIVISOR;

						return (
							<Group
								key={`edge-${String(item.id)}-${String(index)}`}
								onClick={handleEdgeMidpointClick(index)}
								x={midpointPixelX}
								y={midpointPixelY}
							>
								<Circle
									fill={CANVAS_PALETTE.INSERT_BACKDROP}
									radius={CANVAS_INSERT_HANDLE.RADIUS}
									stroke={CANVAS_HANDLE.STROKE}
									strokeWidth={CANVAS_HANDLE.STROKE_WIDTH}
								/>
								<Line
									points={[
										-CANVAS_INSERT_HANDLE.ICON_HALF_LENGTH,
										ICON_CENTER,
										CANVAS_INSERT_HANDLE.ICON_HALF_LENGTH,
										ICON_CENTER,
									]}
									stroke={CANVAS_HANDLE.STROKE}
									strokeWidth={CANVAS_INSERT_HANDLE.ICON_STROKE_WIDTH}
								/>
								<Line
									points={[
										ICON_CENTER,
										-CANVAS_INSERT_HANDLE.ICON_HALF_LENGTH,
										ICON_CENTER,
										CANVAS_INSERT_HANDLE.ICON_HALF_LENGTH,
									]}
									stroke={CANVAS_HANDLE.STROKE}
									strokeWidth={CANVAS_INSERT_HANDLE.ICON_STROKE_WIDTH}
								/>
							</Group>
						);
					})}
					{item.polygon.map((point, index) => {
						const [pixelX, pixelY] = coords.toPixel(point);

						return (
							<Circle
								draggable
								fill={CANVAS_PALETTE.ACTIVE_STROKE}
								key={`vertex-${String(item.id)}-${String(index)}`}
								{...(canDeleteVertex && { onContextMenu: handleVertexContextMenu(index) })}
								onDragMove={handleVertexDragMove(index)}
								radius={CANVAS_HANDLE.RADIUS}
								stroke={CANVAS_HANDLE.STROKE}
								strokeWidth={CANVAS_HANDLE.STROKE_WIDTH}
								x={pixelX}
								y={pixelY}
							/>
						);
					})}
				</>
			)}
		</Group>
	);
};

const EditablePolygonOverlay: React.FC<Properties> = ({
	activeItemId,
	coords,
	items,
	onActiveItemChange,
	onPolygonChange,
}) => {
	return (
		<>
			{items.map((item) => (
				<ItemOverlay
					coords={coords}
					isActive={item.id === activeItemId}
					item={item}
					key={item.id}
					onPolygonChange={onPolygonChange}
					onSelect={onActiveItemChange}
				/>
			))}
		</>
	);
};

export { EditablePolygonOverlay };
