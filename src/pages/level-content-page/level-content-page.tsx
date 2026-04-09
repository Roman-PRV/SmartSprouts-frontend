import { FallbackMessage, Loader } from "~/libs/components/components";
import { useGameFetch, useParams, useTranslation } from "~/libs/hooks/hooks";

import { getLevelComponent } from "./level-component-selector";
import styles from "./styles.module.css";

const LevelContentPage: React.FC = () => {
	const { t } = useTranslation();
	const { id, levelId } = useParams();
	const { currentGame, isLoading: isGameLoading } = useGameFetch(id);

	if (!id) {
		return <FallbackMessage message={t("games.level.invalidId")} />;
	}

	if (!levelId) {
		return <FallbackMessage message={t("games.level.noLevel")} />;
	}

	if (isGameLoading) {
		return <Loader hasOverlay />;
	}

	if (!currentGame) {
		return <FallbackMessage message={t("games.level.notFound")} />;
	}

	const LevelComponent = getLevelComponent(currentGame.key);

	if (!LevelComponent) {
		return <FallbackMessage message={t("games.level.unsupportedType", { key: currentGame.key })} />;
	}

	return (
		<div className={styles["page"]}>
			<header className={styles["page__header"]}>
				<h1 className={styles["page__title"]}>
					{t("games.level.title", { levelId, title: currentGame.title })}
				</h1>
			</header>

			<main className={styles["page__content"]}>
				<LevelComponent
					game={currentGame}
					key={`${currentGame.id}-${levelId}`}
					levelId={Number(levelId)}
				/>
			</main>
		</div>
	);
};

export { LevelContentPage };
