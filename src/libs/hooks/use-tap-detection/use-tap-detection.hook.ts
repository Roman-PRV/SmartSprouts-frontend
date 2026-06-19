import { useCallback, useEffect, useMemo, useRef } from "react";

import { type Point } from "~/libs/types/types";

const TAP_MOVE_TOLERANCE_PX = 10;
const PIXEL_X = 0;
const PIXEL_Y = 1;

type TapHandlers = {
	onCancel: () => void;
	onEnd: () => void;
	onMove: (pixel: Point) => void;
	onStart: (pixel: Point) => void;
};

type UseTapDetectionReturn = {
	handlers: TapHandlers;
};

/**
 * Recognises a tap (pointer down → up with little movement) and reports it in
 * normalized coords. The handler shape mirrors `usePointerDrawing`, so a canvas
 * can swap drawing ↔ tap purely by mode without branching each pointer event. A
 * drag farther than `TAP_MOVE_TOLERANCE_PX` is treated as not-a-tap and ignored.
 */
const useTapDetection = (
	toNormalized: (pixel: Point) => Point,
	enabled: boolean,
	onTap?: (point: Point) => void
): UseTapDetectionReturn => {
	const startReference = useRef<null | Point>(null);
	const lastReference = useRef<null | Point>(null);
	// Latest-callback ref so handler identity stays stable across inline `onTap`.
	const onTapReference = useRef(onTap);

	useEffect(() => {
		onTapReference.current = onTap;
	}, [onTap]);

	const onStart = useCallback(
		(pixel: Point): void => {
			if (!enabled) {
				return;
			}

			startReference.current = pixel;
			lastReference.current = pixel;
		},
		[enabled]
	);

	const onMove = useCallback(
		(pixel: Point): void => {
			if (!enabled || !startReference.current) {
				return;
			}

			lastReference.current = pixel;
		},
		[enabled]
	);

	const onEnd = useCallback((): void => {
		const start = startReference.current;
		const last = lastReference.current;

		startReference.current = null;
		lastReference.current = null;

		if (!enabled || !start || !last) {
			return;
		}

		const moved = Math.hypot(last[PIXEL_X] - start[PIXEL_X], last[PIXEL_Y] - start[PIXEL_Y]);

		if (moved <= TAP_MOVE_TOLERANCE_PX) {
			onTapReference.current?.(toNormalized(last));
		}
	}, [enabled, toNormalized]);

	const onCancel = useCallback((): void => {
		startReference.current = null;
		lastReference.current = null;
	}, []);

	// Drop an in-flight tap if the mode is switched off mid-gesture.
	useEffect(() => {
		if (!enabled) {
			startReference.current = null;
			lastReference.current = null;
		}
	}, [enabled]);

	const handlers = useMemo<TapHandlers>(
		() => ({ onCancel, onEnd, onMove, onStart }),
		[onCancel, onEnd, onMove, onStart]
	);

	return { handlers };
};

export { useTapDetection };
