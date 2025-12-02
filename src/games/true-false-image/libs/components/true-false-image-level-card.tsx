import { actions as trueFalseImageActions } from "~/games/true-false-image/api/true-false-image-game";
import { getValidClassNames } from "~/libs/helpers/helpers";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useState,
} from "~/libs/hooks/hooks";
import { type LevelCardProperties } from "~/libs/types/types";

import { type TrueFalseImageResultDto } from "../types/types";
import styles from "./styles.module.css";

const TrueFalseImageLevelCard: React.FC<LevelCardProperties> = ({ game, levelId }) => {
	const storageKey = `tfi-${game.id}-${String(levelId)}`;
	const dispatch = useAppDispatch();

	const level = useAppSelector((state) => state.trueFalseImageLevels.currentLevel);
	const [answers, setAnswers] = useState<Record<number, boolean>>({});
	const [results] = useState<null | TrueFalseImageResultDto[]>(null);
	const [isSubmitting] = useState<boolean>(false);

	// TODO: Implement answer submission functionality
	// const handleSubmit = useCallback(() => { ... }, []);
	// This will use setResults and setIsSubmitting

	useEffect((): void => {
		const saved = localStorage.getItem(storageKey);

		if (saved) {
			try {
				const parsed = JSON.parse(saved) as Record<number, boolean>;
				setAnswers(parsed);
			} catch {
				localStorage.removeItem(storageKey);
			}
		}
	}, [storageKey]);

	useEffect(() => {
		void dispatch(
			trueFalseImageActions.getLevelById({ gameId: game.id, levelId: String(levelId) })
		);
	}, [dispatch, game.id, levelId]);

	useEffect((): void => {
		localStorage.setItem(storageKey, JSON.stringify(answers));
	}, [answers, storageKey]);

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

	const createSelectHandler = useCallback(
		(statementId: number, value: boolean) => (): void => {
			handleSelect(statementId, value);
		},
		[handleSelect]
	);

	if (!level) {
		return <div>Loading level...</div>;
	}

	const MINIMUM_STATEMENTS = 0;
	const allAnswered: boolean =
		level.statements.length > MINIMUM_STATEMENTS &&
		level.statements.every((s) => answers[s.id] !== undefined);

	return (
		<div className={getValidClassNames(styles["level-card"])}>
			<h2 className={getValidClassNames(styles["level-card__title"])}>{level.title}</h2>

			{level.image_url && (
				<img alt={level.title} className={getValidClassNames(styles["level-card__image"])} src={level.image_url} />
			)}

			<div className={getValidClassNames(styles["level-card__statements"])}>
				{level.statements.map((s) => {
					const selected = answers[s.id];
					const result = results?.find((r) => r.statement_id === s.id);

					return (
						<div className={getValidClassNames(styles["statement"])} key={s.id}>
							<p className={getValidClassNames(styles["statement__text"])}>{s.statement}</p>

							<div className={getValidClassNames(styles["statement__buttons"])}>
								<button
									className={getValidClassNames(
										selected === true ? styles["statement__button--selected-true"] : styles["statement__button"]
									)}
									disabled={results !== null}
									onClick={createSelectHandler(s.id, true)}
								>
									✅
								</button>

								<button
									className={getValidClassNames(
										selected === false ? styles["statement__button--selected-false"] : styles["statement__button"]
									)}
									disabled={results !== null}
									onClick={createSelectHandler(s.id, false)}
								>
									❌
								</button>
							</div>

							{result && (
								<div
									className={getValidClassNames(
										styles["statement__result"],
										result.correct ? styles["statement__result--correct"] : styles["statement__result--incorrect"]
									)}
								>
									{result.correct ? "Correct" : "Incorrect"} — {result.explanation}
								</div>
							)}
						</div>
					);
				})}
			</div>

			<button
				className={getValidClassNames(styles["level-card__submit"])}
				disabled={!allAnswered || isSubmitting || results !== null}
			>
				{isSubmitting ? "Checking..." : "Check Answers"}
			</button>
		</div>
	);
};

export { TrueFalseImageLevelCard };
