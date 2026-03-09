import { useCallback, useEffect, useState } from "react";

import { actions as trueFalseGameActions } from "~/games/true-false-game/api/true-false-game";
import {
	type TrueFalseGameLevelDto,
	type TrueFalseGameResultDto,
} from "~/games/true-false-game/libs/types/types";
import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { type DataStatus } from "~/libs/enums/enums";
import { useAppDispatch } from "~/libs/hooks/use-app-dispatch/use-app-dispatch.hook";
import { useAppSelector } from "~/libs/hooks/use-app-selector/use-app-selector.hook";
import { useLanguageSync } from "~/libs/hooks/use-language-sync/use-language-sync.hook";
import { type GameDescriptionDto, type ValueOf } from "~/libs/types/types";

type UseTrueFalseGameProperties = {
	game: GameDescriptionDto;
	levelId: number;
};

type UseTrueFalseGameReturn = {
	allAnswered: boolean;
	answers: Record<number, boolean>;
	handleReset: () => void;
	handleSelect: (statementId: number, value: boolean) => void;
	handleSubmit: () => Promise<void>;
	hasSubmitError: boolean;
	isSubmitting: boolean;
	level: null | TrueFalseGameLevelDto;
	results: null | TrueFalseGameResultDto[];
	status: ValueOf<typeof DataStatus>;
	storageKey: string;
};

const useTrueFalseGame = ({
	game,
	levelId,
}: UseTrueFalseGameProperties): UseTrueFalseGameReturn => {
	const storageKey = `tf-${game.id}-${String(levelId)}`;
	const dispatch = useAppDispatch();

	const level = useAppSelector((state) => state.trueFalseLevels.currentLevel);
	const status = useAppSelector((state) => state.trueFalseLevels.currentStatus);

	const [answers, setAnswers] = useState<Record<number, boolean>>({});
	const [results, setResults] = useState<null | TrueFalseGameResultDto[]>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [hasSubmitError, setHasSubmitError] = useState<boolean>(false);

	const handleSubmit = useCallback(async (): Promise<void> => {
		if (!level || isSubmitting || results !== null) {
			return;
		}

		setIsSubmitting(true);
		setHasSubmitError(false);

		try {
			const answersArray = Object.entries(answers).map(([statementId, answer]) => ({
				answer,
				statement_id: Number(statementId),
			}));

			const result = await dispatch(
				trueFalseGameActions.checkAnswers({
					gameId: game.id,
					levelId: String(levelId),
					payload: {
						answers: answersArray,
						level_id: level.id,
					},
				})
			).unwrap();

			setResults(result.results);
		} catch {
			setHasSubmitError(true);
		} finally {
			setIsSubmitting(false);
		}
	}, [level, isSubmitting, results, answers, dispatch, game.id, levelId]);

	const handleReset = useCallback((): void => {
		setAnswers({});
		setResults(null);
		setHasSubmitError(false);
		localStorage.removeItem(storageKey);
	}, [storageKey]);

	const handleSelect = useCallback(
		(statementId: number, value: boolean): void => {
			if (results !== null) {
				return;
			}

			setAnswers((previous) => ({
				...previous,
				[statementId]: value,
			}));
		},
		[results]
	);

	useLanguageSync(
		useCallback(() => {
			void dispatch(
				trueFalseGameActions.getLevelById({ gameId: game.id, levelId: String(levelId) })
			);
		}, [dispatch, game.id, levelId])
	);

	useEffect(() => {
		void dispatch(trueFalseGameActions.getLevelById({ gameId: game.id, levelId: String(levelId) }));

		return (): void => {
			dispatch(trueFalseGameActions.clearCurrentLevel());
		};
	}, [dispatch, game.id, levelId]);

	useEffect(() => {
		const saved = localStorage.getItem(storageKey);

		if (saved) {
			try {
				const parsed = JSON.parse(saved) as Record<number, boolean>;
				setAnswers(parsed);
			} catch {
				// Invalid JSON, ignore
			}
		}
	}, [storageKey]);

	useEffect(() => {
		if (Object.keys(answers).length > EMPTY_ARRAY_LENGTH || results !== null) {
			localStorage.setItem(storageKey, JSON.stringify(answers));
		}
	}, [answers, storageKey, results]);

	const allAnswered: boolean =
		Boolean(level) &&
		(level?.statements.length ?? EMPTY_ARRAY_LENGTH) > EMPTY_ARRAY_LENGTH &&
		level?.statements.every((s) => s.id in answers) === true;

	return {
		allAnswered,
		answers,
		handleReset,
		handleSelect,
		handleSubmit,
		hasSubmitError,
		isSubmitting,
		level,
		results,
		status,
		storageKey,
	};
};

export { useTrueFalseGame };
