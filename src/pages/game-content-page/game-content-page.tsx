import { FallbackMessage, Loader } from "~/libs/components/components";
import { GameLevelsPreview } from "~/libs/components/game-levels-preview/game-levels-preview";
import { useGameFetch, useParams, useTranslation } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";

const GameContentPage: React.FC = () => {
	const { t } = useTranslation();
	const { id } = useParams();
	const { currentGame, isLoading: isGameLoading } = useGameFetch(id);

	const renderError = (message: string): React.JSX.Element => (
		<div className={styles["game-content-page__error-container"]}>
			<header>
				<h1 className={styles["game-content-page__error-title"]}>
					{t("games.content.errorTitle")}
				</h1>
			</header>
			<FallbackMessage message={message} />
		</div>
	);

	if (!id) {
		return renderError(t("games.content.invalidId"));
	}

	if (isGameLoading) {
		return <Loader hasOverlay />;
	}

	if (!currentGame) {
		return renderError(t("games.content.notFound"));
	}

	return <GameLevelsPreview game={currentGame} />;
};

export { GameContentPage };
