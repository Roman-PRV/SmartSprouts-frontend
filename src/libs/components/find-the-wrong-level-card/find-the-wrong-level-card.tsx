import { DrawingCanvas, ErrorKind } from "~/games/find-the-wrong/find-the-wrong";
import {
	AudioPlayButton,
	Button,
	FallbackMessage,
	Link,
	Loader,
} from "~/libs/components/components";
import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
import { useCallback, useFindTheWrongGame, useTranslation } from "~/libs/hooks/hooks";
import { type LevelCardProperties } from "~/libs/types/types";

import { FindTheWrongResultPanel } from "./find-the-wrong-result-panel/find-the-wrong-result-panel";
import styles from "./styles.module.css";

const FindTheWrongLevelCard: React.FC<LevelCardProperties> = ({ game, levelId }) => {
	const { t } = useTranslation();

	const {
		addStroke,
		clearStrokes,
		errorKind,
		handleReset,
		handleSubmit,
		hasSubmitError,
		isSubmitting,
		level,
		status,
		strokes,
		submitResult,
	} = useFindTheWrongGame({ game, levelId });

	const handleSubmitClick = useCallback((): void => {
		void handleSubmit();
	}, [handleSubmit]);

	if (status === DataStatus.PENDING) {
		return <Loader variant="overlay" />;
	}

	if (status === DataStatus.REJECTED) {
		const message =
			errorKind === ErrorKind.NOT_FOUND
				? t("games.findTheWrong.error.notFound")
				: t("games.findTheWrong.error.load");

		return <FallbackMessage message={message} />;
	}

	if (!level) {
		return <FallbackMessage message={t("games.findTheWrong.error.notFound")} />;
	}

	if (submitResult) {
		return <FindTheWrongResultPanel onPlayAgain={handleReset} result={submitResult} />;
	}

	return (
		<div className={styles["level-card"]}>
			<div className={styles["level-card__title-container"]}>
				<h2 className={styles["level-card__title"]}>{level.title}</h2>
				<AudioPlayButton url={level.title_audio_url} />
			</div>

			{level.image_url ? (
				<div className={styles["level-card__canvas"]}>
					<DrawingCanvas
						imageUrl={level.image_url}
						mode="player"
						onStrokeComplete={addStroke}
						polygons={[]}
						strokes={strokes}
					/>
				</div>
			) : (
				<FallbackMessage message={t("games.findTheWrong.error.noImage")} />
			)}

			{hasSubmitError && (
				<div className={styles["level-card__error"]} role="alert">
					{t("games.findTheWrong.error.submit")}
				</div>
			)}

			<div className={styles["level-card__actions"]}>
				<Button
					disabled={strokes.length === EMPTY_ARRAY_LENGTH}
					onClick={clearStrokes}
					variant="secondary"
				>
					{t("games.findTheWrong.actions.clear")}
				</Button>
				<Button
					disabled={strokes.length === EMPTY_ARRAY_LENGTH}
					isLoading={isSubmitting}
					onClick={handleSubmitClick}
				>
					{t("games.findTheWrong.actions.done")}
				</Button>
			</div>

			<Link className={styles["level-card__back-link"]} to={`/games/${game.id}`}>
				{t("games.findTheWrong.actions.back")}
			</Link>
		</div>
	);
};

export { FindTheWrongLevelCard };
