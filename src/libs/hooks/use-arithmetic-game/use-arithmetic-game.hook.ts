import { useCallback, useEffect, useState } from "react";

import {
	type ArithmeticAttemptResponseDto,
	actions as arithmeticGameActions,
	type ArithmeticLevelDto,
	ErrorKind,
} from "~/games/arithmetic/arithmetic";
import { type DataStatus } from "~/libs/enums/enums";
import { useAppDispatch } from "~/libs/hooks/use-app-dispatch/use-app-dispatch.hook";
import { useAppSelector } from "~/libs/hooks/use-app-selector/use-app-selector.hook";
import {
	useCardBoard,
	type UseCardBoardReturn,
} from "~/libs/hooks/use-card-board/use-card-board.hook";
import { useLanguageSync } from "~/libs/hooks/use-language-sync/use-language-sync.hook";
import { HTTPCode } from "~/libs/modules/http/http";
import { type GameDescriptionDto, type ValueOf } from "~/libs/types/types";

const EMPTY_EQUATIONS: ArithmeticLevelDto["equations"] = [];

type UseArithmeticGameProperties = {
	game: GameDescriptionDto;
	levelId: number;
};

type UseArithmeticGameReturn = {
	board: UseCardBoardReturn;
	errorKind: null | ValueOf<typeof ErrorKind>;
	handleReset: () => void;
	handleSubmit: () => Promise<void>;
	hasSubmitError: boolean;
	isSubmitting: boolean;
	level: ArithmeticLevelDto | null;
	status: ValueOf<typeof DataStatus>;
	submitResult: ArithmeticAttemptResponseDto | null;
};

/**
 * Generic player controller for the whole arithmetic game family. Reads the
 * level from the shared slice, composes the operation-agnostic drag board, and
 * keeps the submit result locally (mirrors useTrueFalseGame). The concrete game
 * is chosen purely by `game`/`levelId`, so multiplication and addition reuse it.
 */
const useArithmeticGame = ({
	game,
	levelId,
}: UseArithmeticGameProperties): UseArithmeticGameReturn => {
	const dispatch = useAppDispatch();

	const level = useAppSelector((state) => state.arithmeticLevels.currentLevel);
	const status = useAppSelector((state) => state.arithmeticLevels.currentStatus);
	const error = useAppSelector((state) => state.arithmeticLevels.error);

	const board = useCardBoard(level?.equations ?? EMPTY_EQUATIONS);

	const [submitResult, setSubmitResult] = useState<ArithmeticAttemptResponseDto | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [hasSubmitError, setHasSubmitError] = useState<boolean>(false);

	const handleSubmit = useCallback(async (): Promise<void> => {
		if (!board.allMatched || isSubmitting || submitResult !== null) {
			return;
		}

		setIsSubmitting(true);
		setHasSubmitError(false);

		try {
			const result = await dispatch(
				arithmeticGameActions.submitAttempt({
					gameId: game.id,
					levelId: String(levelId),
					payload: { answers: board.buildAnswers() },
				})
			).unwrap();

			setSubmitResult(result);
		} catch {
			setHasSubmitError(true);
		} finally {
			setIsSubmitting(false);
		}
	}, [board, isSubmitting, submitResult, dispatch, game.id, levelId]);

	const handleReset = useCallback((): void => {
		board.reset();
		setSubmitResult(null);
		setHasSubmitError(false);
	}, [board]);

	useLanguageSync(
		useCallback(() => {
			void dispatch(
				arithmeticGameActions.getLevelById({ gameId: game.id, levelId: String(levelId) })
			);
		}, [dispatch, game.id, levelId])
	);

	useEffect(() => {
		void dispatch(
			arithmeticGameActions.getLevelById({ gameId: game.id, levelId: String(levelId) })
		);

		return (): void => {
			dispatch(arithmeticGameActions.clearCurrentLevel());
		};
	}, [dispatch, game.id, levelId]);

	let errorKind: null | ValueOf<typeof ErrorKind> = null;

	if (error) {
		errorKind = error.status === HTTPCode.NOT_FOUND ? ErrorKind.NOT_FOUND : ErrorKind.GENERIC;
	}

	return {
		board,
		errorKind,
		handleReset,
		handleSubmit,
		hasSubmitError,
		isSubmitting,
		level,
		status,
		submitResult,
	};
};

export { useArithmeticGame };
