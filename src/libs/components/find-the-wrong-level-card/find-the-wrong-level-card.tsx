import {
	DrawingCanvas,
	ErrorKind,
	INTERACTION_MODES,
	InteractionMode,
	isInteractionMode,
} from "~/games/find-the-wrong/find-the-wrong";
import {
	AudioPlayButton,
	Button,
	FallbackMessage,
	Link,
	Loader,
} from "~/libs/components/components";
import { DataStatus } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import {
	useCallback,
	useFindTheWrongGame,
	useId,
	useState,
	useTranslation,
} from "~/libs/hooks/hooks";
import { type LevelCardProperties, type ValueOf } from "~/libs/types/types";

import { FindTheWrongResultPanel } from "./find-the-wrong-result-panel/find-the-wrong-result-panel";
import styles from "./styles.module.css";

// Single source of truth for play modes: drives the radio options AND the hint.
// Typed as Record<Mode, …> so adding an InteractionMode forces a config entry
// (compile error) instead of silently falling back.
const MODE_CONFIG: Record<ValueOf<typeof InteractionMode>, { hintKey: string; labelKey: string }> = {
	[InteractionMode.CIRCLE]: {
		hintKey: "games.findTheWrong.hint.circle",
		labelKey: "games.findTheWrong.mode.circle",
	},
	[InteractionMode.MARKER]: {
		hintKey: "games.findTheWrong.hint.marker",
		labelKey: "games.findTheWrong.mode.marker",
	},
};

const FindTheWrongLevelCard: React.FC<LevelCardProperties> = ({ game, levelId }) => {
	const { t } = useTranslation();

	const {
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
	} = useFindTheWrongGame({ game, levelId });

	const modeGroupName = useId();
	const [isReviewing, setIsReviewing] = useState<boolean>(false);

	const handleSubmitClick = useCallback((): void => {
		void handleSubmit();
	}, [handleSubmit]);

	const handlePlayAgain = useCallback((): void => {
		setIsReviewing(false);
		handleReset();
	}, [handleReset]);

	const startReview = useCallback((): void => {
		setIsReviewing(true);
	}, []);

	const exitReview = useCallback((): void => {
		setIsReviewing(false);
	}, []);

	const handleModeChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>): void => {
			const { value } = event.target;

			if (isInteractionMode(value)) {
				setInteractionMode(value);
			}
		},
		[setInteractionMode]
	);

	if (status === DataStatus.PENDING || status === DataStatus.IDLE) {
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

	const isMarkerMode = interactionMode === InteractionMode.MARKER;

	const renderCanvas = (interactive: boolean): React.JSX.Element => {
		if (!level.image_url) {
			return <FallbackMessage message={t("games.findTheWrong.error.noImage")} />;
		}

		return (
			<div className={styles["level-card__canvas"]}>
				{isMarkerMode ? (
					<DrawingCanvas
						imageUrl={level.image_url}
						interactive={interactive}
						markers={markers}
						mode="marker"
						onMarkerToggle={toggleMarker}
						polygons={[]}
					/>
				) : (
					<DrawingCanvas
						imageUrl={level.image_url}
						interactive={interactive}
						mode="player"
						onStrokeComplete={addStroke}
						polygons={[]}
						strokes={strokes}
					/>
				)}
			</div>
		);
	};

	if (submitResult) {
		if (isReviewing) {
			return (
				<div className={styles["level-card"]}>
					<div className={styles["level-card__title-container"]}>
						<h2 className={styles["level-card__title"]}>{level.title}</h2>
						<AudioPlayButton url={level.title_audio_url} />
					</div>

					{renderCanvas(false)}

					<div className={styles["level-card__primary"]}>
						<Button
							fullWidth
							onClick={exitReview}
							size="lg"
						>
							{t("games.actions.backToResults")}
						</Button>
					</div>
				</div>
			);
		}

		return (
			<FindTheWrongResultPanel
				onPlayAgain={handlePlayAgain}
				onReview={startReview}
				result={submitResult}
			/>
		);
	}

	const activeHint = MODE_CONFIG[interactionMode].hintKey;

	return (
		<div className={styles["level-card"]}>
			<div className={styles["level-card__title-container"]}>
				<h2 className={styles["level-card__title"]}>{level.title}</h2>
				<AudioPlayButton url={level.title_audio_url} />
			</div>

			<fieldset className={styles["level-card__mode"]}>
				<legend className={styles["level-card__mode-legend"]}>
					{t("games.findTheWrong.mode.label")}
				</legend>

				{INTERACTION_MODES.map((mode) => {
					const isActive = interactionMode === mode;

					return (
						<label
							className={getValidClassNames(
								styles["level-card__mode-option"],
								isActive && styles["level-card__mode-option--active"]
							)}
							key={mode}
						>
							<input
								checked={isActive}
								className={styles["level-card__mode-input"]}
								name={modeGroupName}
								onChange={handleModeChange}
								type="radio"
								value={mode}
							/>
							{t(MODE_CONFIG[mode].labelKey)}
						</label>
					);
				})}
			</fieldset>

			<p className={styles["level-card__hint"]}>{t(activeHint)}</p>

			{renderCanvas(true)}

			<p className={styles["level-card__counter"]}>
				{t("games.findTheWrong.counter", { limit: markLimit, used: markCount })}
			</p>

			<div className={styles["level-card__primary"]}>
				<Button
					disabled={!hasMarks}
					fullWidth
					isLoading={isSubmitting}
					onClick={handleSubmitClick}
					size="lg"
				>
					{t("games.actions.submit")}
				</Button>
			</div>

			{hasSubmitError && (
				<div className={styles["level-card__error"]} role="alert">
					{t("games.findTheWrong.error.submit")}
				</div>
			)}

			<div className={styles["level-card__actions"]}>
				<Link
					className={getValidClassNames(
						styles["level-card__action"],
						styles["level-card__back-link"]
					)}
					to={`/games/${game.id}`}
				>
					{t("games.actions.back")}
				</Link>

				<Button
					className={styles["level-card__action"]}
					disabled={!hasMarks}
					onClick={clearMarks}
					variant="secondary"
				>
					{t("games.actions.reset")}
				</Button>
			</div>
		</div>
	);
};

export { FindTheWrongLevelCard };
