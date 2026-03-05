import { Link } from "react-router-dom";

import { DataStatus, GameKey } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useCallback, useTranslation, useTrueFalseGame } from "~/libs/hooks/hooks";
import { type LevelCardProperties } from "~/libs/types/types";

import styles from "./styles.module.css";
import { TrueFalseStatement } from "./true-false-statement/true-false-statement";

const TrueFalseLevelCard: React.FC<LevelCardProperties> = ({ game, levelId }) => {
	const { t } = useTranslation();

	const {
		allAnswered,
		answers,
		handleReset,
		handleSelect,
		handleSubmit,
		isSubmitting,
		level,
		results,
		status,
		storageKey,
		submitError,
	} = useTrueFalseGame({ game, levelId });

	const handleBackToLevels = useCallback((): void => {
		localStorage.removeItem(storageKey);
	}, [storageKey]);

	const handleSubmitClick = useCallback((): void => {
		void handleSubmit();
	}, [handleSubmit]);

	if (status === DataStatus.PENDING) {
		return <div>{t("games.trueFalse.loading.load")}</div>;
	}

	if (status === DataStatus.REJECTED) {
		return <div>{t("games.trueFalse.error.load")}</div>;
	}

	if (!level) {
		return <div>{t("games.trueFalse.error.notFound")}</div>;
	}

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
				{isSubmitting ? t("games.trueFalse.loading.check") : t("games.trueFalse.submit")}
			</button>

			{submitError && (
				<div className={getValidClassNames(styles["level-card__error"])}>
					{t("games.trueFalse.error.check")}
				</div>
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
					{t("games.trueFalse.actions.back")}
				</Link>

				<button
					className={getValidClassNames(
						styles["level-card__action-button"],
						styles["level-card__action-button--accent"]
					)}
					onClick={handleReset}
				>
					{t("games.trueFalse.actions.reset")}
				</button>
			</div>
		</div>
	);
};

export { TrueFalseLevelCard };
