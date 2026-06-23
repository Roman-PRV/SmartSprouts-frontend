import { ErrorKind } from "~/games/arithmetic/arithmetic";
import {
	Button,
	FallbackMessage,
	Link,
	Loader,
} from "~/libs/components/components";
import { DataStatus } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useArithmeticGame, useCallback, useTranslation } from "~/libs/hooks/hooks";
import { type LevelCardProperties } from "~/libs/types/types";

import { ArithmeticBoard } from "./arithmetic-board/arithmetic-board";
import { ArithmeticResultPanel } from "./arithmetic-result-panel/arithmetic-result-panel";
import styles from "./styles.module.css";

const ArithmeticLevelCard: React.FC<LevelCardProperties> = ({ game, levelId }) => {
	const { t } = useTranslation();

	const {
		board,
		errorKind,
		handleReset,
		handleSubmit,
		hasSubmitError,
		isSubmitting,
		level,
		status,
		submitResult,
	} = useArithmeticGame({ game, levelId });

	const handleSubmitClick = useCallback((): void => {
		void handleSubmit();
	}, [handleSubmit]);

	if (status === DataStatus.PENDING || status === DataStatus.IDLE) {
		return <Loader variant="overlay" />;
	}

	if (status === DataStatus.REJECTED) {
		const message =
			errorKind === ErrorKind.NOT_FOUND
				? t("games.arithmetic.error.notFound")
				: t("games.arithmetic.error.load");

		return <FallbackMessage message={message} />;
	}

	if (!level) {
		return <FallbackMessage message={t("games.arithmetic.error.notFound")} />;
	}

	const isCompleted = submitResult !== null;

	return (
		<div className={styles["level-card"]}>
			<h2 className={styles["level-card__title"]}>{level.title}</h2>

			{isCompleted ? (
				<ArithmeticResultPanel
					onPlayAgain={handleReset}
					operator={level.operator}
					result={submitResult}
				/>
			) : (
				<>
					<ArithmeticBoard board={board} operator={level.operator} />

					<div className={styles["level-card__primary"]}>
						<Button
							disabled={!board.allMatched}
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
							{t("games.arithmetic.error.submit")}
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
							onClick={handleReset}
							variant="secondary"
						>
							{t("games.actions.reset")}
						</Button>
					</div>
				</>
			)}
		</div>
	);
};

export { ArithmeticLevelCard };
