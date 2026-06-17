import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { actions as findTheWrongGameActions } from "~/games/find-the-wrong/api/find-the-wrong-game";
import {
	buildSubmitPayload,
	ErrorKind,
	type FindTheWrongLevelDto,
	InteractionMode,
	type Marker,
	type MatchableItem,
	matchStrokesToItems,
	matchTapsToItems,
	type SubmitAttemptResponseDto,
	useMarkers,
	useStrokes,
} from "~/games/find-the-wrong/find-the-wrong";
import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { type DataStatus } from "~/libs/enums/enums";
import { useAppDispatch } from "~/libs/hooks/use-app-dispatch/use-app-dispatch.hook";
import { useAppSelector } from "~/libs/hooks/use-app-selector/use-app-selector.hook";
import { useLanguageSync } from "~/libs/hooks/use-language-sync/use-language-sync.hook";
import { HTTPCode } from "~/libs/modules/http/http";
import { type GameDescriptionDto, type Point, type ValueOf } from "~/libs/types/types";

const MS_PER_SECOND = 1000;
const MIN_DURATION_SECONDS = 0;
const MAX_DURATION_SECONDS = 3600;

type UseFindTheWrongGameProperties = {
	game: GameDescriptionDto;
	levelId: number;
};

type UseFindTheWrongGameReturn = {
	addStroke: (points: Point[]) => void;
	clearMarks: () => void;
	errorKind: null | ValueOf<typeof ErrorKind>;
	handleReset: () => void;
	handleSubmit: () => Promise<void>;
	hasMarks: boolean;
	hasSubmitError: boolean;
	interactionMode: ValueOf<typeof InteractionMode>;
	isSubmitting: boolean;
	level: FindTheWrongLevelDto | null;
	markCount: number;
	markers: Marker[];
	markLimit: number;
	setInteractionMode: (mode: ValueOf<typeof InteractionMode>) => void;
	status: ValueOf<typeof DataStatus>;
	strokes: ReturnType<typeof useStrokes>["strokes"];
	submitResult: null | SubmitAttemptResponseDto;
	toggleMarker: (point: Point) => void;
};

const useFindTheWrongGame = ({
	game,
	levelId,
}: UseFindTheWrongGameProperties): UseFindTheWrongGameReturn => {
	const dispatch = useAppDispatch();
	const levelIdString = String(levelId);

	const level = useAppSelector((state) => state.findTheWrongLevels.currentLevel);
	const status = useAppSelector((state) => state.findTheWrongLevels.currentStatus);
	const error = useAppSelector((state) => state.findTheWrongLevels.error);

	const matchables = useMemo<MatchableItem[]>(
		() => (level?.items ?? []).map((item) => ({ id: item.id, polygon: item.polygon })),
		[level]
	);

	const markLimit = matchables.length;

	const { addStroke, clearAll: clearStrokes, strokes } = useStrokes(markLimit);
	const { clearAll: clearMarkers, markers, toggleMarker } = useMarkers(markLimit);
	const [interactionMode, setInteractionModeState] = useState<ValueOf<typeof InteractionMode>>(
		InteractionMode.CIRCLE
	);
	const [submitResult, setSubmitResult] = useState<null | SubmitAttemptResponseDto>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [hasSubmitError, setHasSubmitError] = useState<boolean>(false);
	const startReference = useRef<number>(Date.now());

	const isMarkerMode = interactionMode === InteractionMode.MARKER;
	const markCount = isMarkerMode ? markers.length : strokes.length;
	const hasMarks = markCount > EMPTY_ARRAY_LENGTH;

	useEffect(() => {
		startReference.current = Date.now();
	}, [level?.id]);

	const handleSubmit = useCallback(async (): Promise<void> => {
		if (!level || isSubmitting || submitResult !== null || !hasMarks) {
			return;
		}

		setIsSubmitting(true);
		setHasSubmitError(false);

		try {
			const result = isMarkerMode
				? matchTapsToItems(markers, matchables, startReference.current)
				: matchStrokesToItems(strokes, matchables);
			const elapsed = Math.round((Date.now() - startReference.current) / MS_PER_SECOND);
			const durationSeconds = Math.min(
				Math.max(elapsed, MIN_DURATION_SECONDS),
				MAX_DURATION_SECONDS
			);
			const payload = buildSubmitPayload(result, durationSeconds, interactionMode);

			const response = await dispatch(
				findTheWrongGameActions.submitAttempt({
					gameId: game.id,
					levelId: levelIdString,
					payload,
				})
			).unwrap();

			setSubmitResult(response);
		} catch {
			setHasSubmitError(true);
		} finally {
			setIsSubmitting(false);
		}
	}, [
		level,
		isSubmitting,
		submitResult,
		hasMarks,
		isMarkerMode,
		markers,
		strokes,
		matchables,
		interactionMode,
		dispatch,
		game.id,
		levelIdString,
	]);

	const clearMarks = useCallback((): void => {
		if (isMarkerMode) {
			clearMarkers();

			return;
		}

		clearStrokes();
	}, [isMarkerMode, clearMarkers, clearStrokes]);

	const handleReset = useCallback((): void => {
		clearStrokes();
		clearMarkers();
		setSubmitResult(null);
		setHasSubmitError(false);
		startReference.current = Date.now();
	}, [clearStrokes, clearMarkers]);

	// Switching mode starts a clean attempt: drop both interaction states and
	// restart the timer so marker timing is fair. Selecting the current mode is a
	// no-op — the hook owns this invariant regardless of how the UI is wired.
	const setInteractionMode = useCallback(
		(mode: ValueOf<typeof InteractionMode>): void => {
			if (mode === interactionMode) {
				return;
			}

			setInteractionModeState(mode);
			clearStrokes();
			clearMarkers();
			setHasSubmitError(false);
			startReference.current = Date.now();
		},
		[interactionMode, clearStrokes, clearMarkers]
	);

	useLanguageSync(
		useCallback(() => {
			void dispatch(
				findTheWrongGameActions.getLevelById({ gameId: game.id, levelId: levelIdString })
			);
		}, [dispatch, game.id, levelIdString])
	);

	useEffect(() => {
		void dispatch(
			findTheWrongGameActions.getLevelById({ gameId: game.id, levelId: levelIdString })
		);

		return (): void => {
			dispatch(findTheWrongGameActions.clearCurrentLevel());
		};
	}, [dispatch, game.id, levelIdString]);

	let errorKind: null | ValueOf<typeof ErrorKind> = null;

	if (error) {
		errorKind = error.status === HTTPCode.NOT_FOUND ? ErrorKind.NOT_FOUND : ErrorKind.GENERIC;
	}

	return {
		addStroke,
		clearMarks,
		errorKind,
		handleReset,
		handleSubmit,
		hasMarks,
		hasSubmitError,
		interactionMode,
		isSubmitting,
		level,
		markCount,
		markers,
		markLimit,
		setInteractionMode,
		status,
		strokes,
		submitResult,
		toggleMarker,
	};
};

export { useFindTheWrongGame };
