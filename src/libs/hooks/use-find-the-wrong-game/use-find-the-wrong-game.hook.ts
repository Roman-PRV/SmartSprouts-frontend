import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { actions as findTheWrongGameActions } from "~/games/find-the-wrong/api/find-the-wrong-game";
import {
	buildSubmitPayload,
	ErrorKind,
	type FindTheWrongLevelDto,
	type MatchableItem,
	matchStrokesToItems,
	type SubmitAttemptResponseDto,
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
	clearStrokes: () => void;
	errorKind: null | ValueOf<typeof ErrorKind>;
	handleReset: () => void;
	handleSubmit: () => Promise<void>;
	hasSubmitError: boolean;
	isSubmitting: boolean;
	level: FindTheWrongLevelDto | null;
	status: ValueOf<typeof DataStatus>;
	strokes: ReturnType<typeof useStrokes>["strokes"];
	submitResult: null | SubmitAttemptResponseDto;
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

	const { addStroke, clearAll, strokes } = useStrokes();
	const [submitResult, setSubmitResult] = useState<null | SubmitAttemptResponseDto>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [hasSubmitError, setHasSubmitError] = useState<boolean>(false);
	const startReference = useRef<number>(Date.now());

	const matchables = useMemo<MatchableItem[]>(
		() => (level?.items ?? []).map((item) => ({ id: item.id, polygon: item.polygon })),
		[level]
	);

	// Restart the attempt timer whenever a fresh level loads.
	useEffect(() => {
		startReference.current = Date.now();
	}, [level?.id]);

	const handleSubmit = useCallback(async (): Promise<void> => {
		if (!level || isSubmitting || submitResult !== null || strokes.length === EMPTY_ARRAY_LENGTH) {
			return;
		}

		setIsSubmitting(true);
		setHasSubmitError(false);

		try {
			const result = matchStrokesToItems(strokes, matchables);
			const elapsed = Math.round((Date.now() - startReference.current) / MS_PER_SECOND);
			const durationSeconds = Math.min(
				Math.max(elapsed, MIN_DURATION_SECONDS),
				MAX_DURATION_SECONDS
			);
			const payload = buildSubmitPayload(result, durationSeconds);

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
	}, [level, isSubmitting, submitResult, strokes, matchables, dispatch, game.id, levelIdString]);

	const handleReset = useCallback((): void => {
		clearAll();
		setSubmitResult(null);
		setHasSubmitError(false);
		startReference.current = Date.now();
	}, [clearAll]);

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
		clearStrokes: clearAll,
		errorKind,
		handleReset,
		handleSubmit,
		hasSubmitError,
		isSubmitting,
		level,
		status,
		strokes,
		submitResult,
	};
};

export { useFindTheWrongGame };
