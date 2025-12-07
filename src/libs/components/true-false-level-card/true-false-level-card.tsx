import { Link } from "react-router-dom";

import { actions as trueFalseImageActions } from "~/games/true-false-image/api/true-false-image-game";
import { type TrueFalseImageResultDto } from "~/games/true-false-image/libs/types/types";
import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { DataStatus, GameKey } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useState,
} from "~/libs/hooks/hooks";
import { type LevelCardProperties } from "~/libs/types/types";

import styles from "./styles.module.css";
import { TrueFalseStatement } from "./true-false-statement/true-false-statement";

const TrueFalseLevelCard: React.FC<LevelCardProperties> = ({ game, levelId }) => {
	const storageKey = `tf-${game.id}-${String(levelId)}`;
	const dispatch = useAppDispatch();

	const level = useAppSelector((state) => state.trueFalseImageLevels.currentLevel);
	const currentStatus = useAppSelector((state) => state.trueFalseImageLevels.currentStatus);

	const [answers, setAnswers] = useState<Record<number, boolean>>({});
	const [results, setResults] = useState<null | TrueFalseImageResultDto[]>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [submitError, setSubmitError] = useState<null | string>(null);

	const handleSubmit = useCallback(async (): Promise<void> => {
		if (!level || isSubmitting || results !== null) {
			return;
		}

		setIsSubmitting(true);
		setSubmitError(null);

		try {
			const answersArray = Object.entries(answers).map(([statementId, answer]) => ({
				answer,
				statement_id: Number(statementId),
			}));

			const result = await dispatch(
				trueFalseImageActions.checkAnswers({
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
			setSubmitError("Failed to check answers. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	}, [level, isSubmitting, results, answers, dispatch, game.id, levelId]);

	const handleSubmitClick = useCallback((): void => {
		void handleSubmit();
	}, [handleSubmit]);

	const handleBackToLevels = useCallback((): void => {
		localStorage.removeItem(storageKey);
	}, [storageKey]);

	const handleReset = useCallback((): void => {
		setAnswers({});
		setResults(null);
		localStorage.removeItem(storageKey);
	}, [storageKey]);

	useEffect(() => {
		void dispatch(
			trueFalseImageActions.getLevelById({ gameId: game.id, levelId: String(levelId) })
		);

		return (): void => {
			dispatch(trueFalseImageActions.clearCurrentLevel());
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

	if (currentStatus === DataStatus.PENDING) {
		return <div>Loading level...</div>;
	}

	if (currentStatus === DataStatus.REJECTED) {
		return <div>Error loading level. Please try again.</div>;
	}

	if (!level) {
		return <div>Level not found.</div>;
	}

	const allAnswered: boolean =
		level.statements.length > EMPTY_ARRAY_LENGTH && level.statements.every((s) => s.id in answers);

	const isTextMode = game.key === GameKey.TRUE_FALSE_TEXT;
	const cardModiferClass = isTextMode ? styles["level-card--text-mode"] : "";
	const imageModifierClass = isTextMode ? styles["level-card__image--small"] : "";

	return (
		<div className={getValidClassNames(styles["level-card"], cardModiferClass)}>
			<h2 className={getValidClassNames(styles["level-card__title"])}>{level.title}</h2>

			{level.image_url && (
				<img
					alt={level.title}
					className={getValidClassNames(styles["level-card__image"], imageModifierClass)}
					src={level.image_url}
				/>
			)}

			{level.text && <p className={getValidClassNames(styles["level-card__text"])}>{level.text}</p>}

			<div className={getValidClassNames(styles["level-card__statements"])}>
				{level.statements.map((s) => {
					const selected = answers[s.id];
					const result = results?.find((r) => r.statement_id === s.id);

					return (
						<TrueFalseStatement
							disabled={results !== null}
							key={s.id}
							onSelect={handleSelect}
							result={result}
							selected={selected}
							statement={s}
						/>
					);
				})}
			</div>

			<button
				className={getValidClassNames(styles["level-card__submit"])}
				disabled={!allAnswered || isSubmitting || results !== null}
				onClick={handleSubmitClick}
			>
				{isSubmitting ? "Checking..." : "Check Answers"}
			</button>

			{submitError && (
				<div className={getValidClassNames(styles["level-card__error"])}>{submitError}</div>
			)}

			<div className={getValidClassNames(styles["level-card__actions"])}>
				<Link
					className={getValidClassNames(
						styles["level-card__action-button"],
						styles["level-card__action-button--secondary"]
					)}
					onClick={handleBackToLevels}
					to={`/games/${game.id}`}
				>
					Back to Levels
				</Link>

				<button
					className={getValidClassNames(
						styles["level-card__action-button"],
						styles["level-card__action-button--accent"]
					)}
					onClick={handleReset}
				>
					Reset Level
				</button>
			</div>
		</div>
	);
};

export { TrueFalseLevelCard };
