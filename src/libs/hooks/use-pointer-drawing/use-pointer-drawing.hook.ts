import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { type Point } from "~/libs/types/types";

type PointerHandlers = {
	onCancel: () => void;
	onEnd: () => void;
	onMove: (pixel: Point) => void;
	onStart: (pixel: Point) => void;
};

type UsePointerDrawingReturn = {
	handlers: PointerHandlers;
	inFlightPoints: Point[];
};

/**
 * Mirrors in-flight points in a ref so consecutive `onMove` calls within
 * the same React batch can append to the latest array synchronously
 * (setState would lag behind during rapid pointer events).
 */
const usePointerDrawing = (
	toNormalized: (pixel: Point) => Point,
	enabled: boolean,
	onComplete?: (points: Point[]) => void
): UsePointerDrawingReturn => {
	const isDrawingReference = useRef<boolean>(false);
	const inFlightReference = useRef<Point[]>([]);
	const [inFlightPoints, setInFlightPoints] = useState<Point[]>([]);

	const onStart = useCallback(
		(pixel: Point): void => {
			if (!enabled) {
				return;
			}

			isDrawingReference.current = true;
			const next = [toNormalized(pixel)];

			inFlightReference.current = next;
			setInFlightPoints(next);
		},
		[enabled, toNormalized]
	);

	const onMove = useCallback(
		(pixel: Point): void => {
			if (!enabled || !isDrawingReference.current) {
				return;
			}

			const next = [...inFlightReference.current, toNormalized(pixel)];

			inFlightReference.current = next;
			setInFlightPoints(next);
		},
		[enabled, toNormalized]
	);

	const onEnd = useCallback((): void => {
		if (!isDrawingReference.current) {
			return;
		}

		isDrawingReference.current = false;
		const captured = inFlightReference.current;

		inFlightReference.current = [];
		setInFlightPoints([]);

		if (enabled && captured.length > EMPTY_ARRAY_LENGTH) {
			onComplete?.(captured);
		}
	}, [enabled, onComplete]);

	const onCancel = useCallback((): void => {
		if (!isDrawingReference.current) {
			return;
		}

		isDrawingReference.current = false;
		inFlightReference.current = [];
		setInFlightPoints([]);
	}, []);

	// Auto-cancel an in-flight stroke when drawing is disabled mid-gesture.
	useEffect(() => {
		if (!enabled && isDrawingReference.current) {
			isDrawingReference.current = false;
			inFlightReference.current = [];
			setInFlightPoints([]);
		}
	}, [enabled]);

	const handlers = useMemo<PointerHandlers>(
		() => ({ onCancel, onEnd, onMove, onStart }),
		[onCancel, onEnd, onMove, onStart]
	);

	return { handlers, inFlightPoints };
};

export { usePointerDrawing };
