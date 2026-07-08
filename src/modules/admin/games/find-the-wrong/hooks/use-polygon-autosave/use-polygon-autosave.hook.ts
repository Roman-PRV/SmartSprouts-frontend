import { useCallback, useEffect, useRef } from "~/libs/hooks/hooks";
import { type Point } from "~/libs/types/types";

const DEFAULT_DELAY_MS = 500;

type SaveFunction = (itemId: number, points: Point[]) => Promise<void> | void;

type ScheduleFunction = (itemId: number, points: Point[]) => void;

type UsePolygonAutosaveReturn = {
	schedule: ScheduleFunction;
};

const dispatchPending = (pending: Map<number, Point[]>, save: SaveFunction): void => {
	for (const [itemId, points] of pending.entries()) {
		const maybePromise = save(itemId, points);

		if (maybePromise instanceof Promise) {
			maybePromise.catch(() => {
				// Errors are surfaced via the save callback's own toast handling.
			});
		}
	}
};

/**
 * Debounces polygon-shape updates per item and flushes any pending changes
 * on unmount so a fast unmount (route change, modal close) doesn't drop
 * the last drag.
 */
const usePolygonAutosave = (
	save: SaveFunction,
	delayMs: number = DEFAULT_DELAY_MS
): UsePolygonAutosaveReturn => {
	const timerReference = useRef<null | ReturnType<typeof setTimeout>>(null);
	const pendingReference = useRef<Map<number, Point[]>>(new Map());
	const saveReference = useRef(save);

	useEffect(() => {
		saveReference.current = save;
	}, [save]);

	const flushPending = useCallback((): void => {
		const pending = pendingReference.current;

		pendingReference.current = new Map();
		dispatchPending(pending, saveReference.current);
	}, []);

	const flush = useCallback((): void => {
		if (timerReference.current !== null) {
			clearTimeout(timerReference.current);
			timerReference.current = null;
		}

		flushPending();
	}, [flushPending]);

	useEffect(() => {
		return (): void => {
			flush();
		};
	}, [flush]);

	const schedule = useCallback<ScheduleFunction>(
		(itemId, points) => {
			pendingReference.current.set(itemId, points);

			if (timerReference.current !== null) {
				clearTimeout(timerReference.current);
			}

			timerReference.current = setTimeout(() => {
				timerReference.current = null;
				flushPending();
			}, delayMs);
		},
		[delayMs, flushPending]
	);

	return { schedule };
};

export { usePolygonAutosave };
