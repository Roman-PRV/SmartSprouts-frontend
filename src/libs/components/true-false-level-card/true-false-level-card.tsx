import { AudioPlayButton, FallbackMessage, Link, Loader } from "~/libs/components/components";
import { DataStatus, GameKey } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useCallback, useMemo, useTranslation, useTrueFalseGame } from "~/libs/hooks/hooks";
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
		hasSubmitError,
		isSubmitting,
		level,
		results,
		status,
	} = useTrueFalseGame({ game, levelId });

	const handleSubmitClick = useCallback((): void => {
		void handleSubmit();
	}, [handleSubmit]);

	const resultsMap = useMemo(() => {
		if (!results) {
			return null;
		}

		const map: Record<number, (typeof results)[number]> = {};

		for (const result of results) {
			map[result.statement_id] = result;
		}

		return map;
	}, [results]);

	if (status === DataStatus.PENDING) {
		return <Loader variant="overlay" />;
	}

	if (status === DataStatus.REJECTED) {
		return <FallbackMessage message={t("games.trueFalse.error.load")} />;
	}

	if (!level) {
		return <FallbackMessage message={t("games.trueFalse.error.notFound")} />;
	}

	const isTextMode = game.key === GameKey.TRUE_FALSE_TEXT;
	const cardModifierClass = isTextMode ? styles["level-card--text-mode"] : "";
	const imageModifierClass = isTextMode ? styles["level-card__image--small"] : "";

	const isLevelCompleted = results !== null;

	return (
		<div className={getValidClassNames(styles["level-card"], cardModifierClass)}>
			<div className={styles["level-card__title-container"]}>
				<h2 className={styles["level-card__title"]}>{level.title}</h2>
				<AudioPlayButton url={level.title_audio_url} />
			</div>

			{level.image_url && (
				<img
					alt={level.title}
					className={getValidClassNames(styles["level-card__image"], imageModifierClass)}
					src={level.image_url}
				/>
			)}

			{level.text && (
				<div className={styles["level-card__text-container"]}>
					<p className={styles["level-card__text"]}>{level.text}</p>
					<AudioPlayButton url={level.text_audio_url} />
				</div>
			)}

			<div className={styles["level-card__statements"]}>
				{level.statements.map((s) => {
					const selected = answers[s.id];
					const result = resultsMap?.[s.id];

					return (
						<TrueFalseStatement
							disabled={isLevelCompleted}
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
				className={styles["level-card__submit"]}
				disabled={!allAnswered || isSubmitting || isLevelCompleted}
				onClick={handleSubmitClick}
				type="button"
			>
				{isSubmitting ? t("games.trueFalse.loading.check") : t("games.trueFalse.submit")}
			</button>

			{hasSubmitError && (
				<div className={styles["level-card__error"]}>{t("games.trueFalse.error.check")}</div>
			)}

			<div className={styles["level-card__actions"]}>
				<Link
					className={getValidClassNames(
						styles["level-card__action-button"],
						styles["level-card__action-button--secondary"]
					)}
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
					type="button"
				>
					{t("games.trueFalse.actions.reset")}
				</button>
			</div>
		</div>
	);
};

export { TrueFalseLevelCard };
