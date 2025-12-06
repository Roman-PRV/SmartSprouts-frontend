import { actions as trueFalseImageActions } from "~/games/true-false-image/api/true-false-image-game";
import { Link } from "~/libs/components/components";
import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/empty-array-length";
import { getValidClassNames } from "~/libs/helpers/helpers";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useState,
} from "~/libs/hooks/hooks";
import { type LevelCardProperties } from "~/libs/types/types";

import { type TrueFalseImageResultDto } from "../../types/types";
import { TrueFalseImageStatement } from "../true-false-image-statement/true-false-image-statement";
import styles from "./styles.module.css";

const TrueFalseImageLevelCard: React.FC<LevelCardProperties> = ({ game, levelId }) => {
	const storageKey = `tfi-${game.id}-${String(levelId)}`;
	const dispatch = useAppDispatch();

	const level = useAppSelector((state) => state.trueFalseImageLevels.currentLevel);

	const loadAnswers = useCallback((): Record<number, boolean> => {
		const saved = localStorage.getItem(storageKey);

		if (saved) {
			try {
				return JSON.parse(saved) as Record<number, boolean>;
			} catch {
				return {};
			}
		}

		return {};
	}, [storageKey]);

	const [answers, setAnswers] = useState<Record<number, boolean>>(loadAnswers);
	const [results, setResults] = useState<null | TrueFalseImageResultDto[]>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const handleSubmit = useCallback(async (): Promise<void> => {
		if (!level || isSubmitting || results !== null) {
			return;
		}

		setIsSubmitting(true);

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
		(statementId: number) => (value: boolean): void => {
			handleSelect(statementId, value);
		},
		[handleSelect]
	);

	if (!level) {
		return <div>Loading level...</div>;
	}

	const allAnswered: boolean =
		level.statements.length > EMPTY_ARRAY_LENGTH &&
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
						<TrueFalseImageStatement
							disabled={results !== null}
							key={s.id}
							onSelect={createSelectHandler(s.id)}
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

			<div className={getValidClassNames(styles["level-card__actions"])}>
				<Link
					className={getValidClassNames(styles["level-card__action-button"])}
					onClick={handleBackToLevels}
					to={`/games/${game.id}`}
				>
					Back to Levels
				</Link>

				<button
					className={getValidClassNames(styles["level-card__action-button"])}
					onClick={handleReset}
				>
					Reset Level
				</button>
			</div>
		</div>
	);
};

export { TrueFalseImageLevelCard };
