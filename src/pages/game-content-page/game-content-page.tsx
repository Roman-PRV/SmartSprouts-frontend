import { FallbackMessage, Loader } from "~/libs/components/components";
import { GameLevelsPreview } from "~/libs/components/game-levels-preview/game-levels-preview";
import { useGameFetch, useLevelsFetch, useParams, useTranslation } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";

const GameContentPage: React.FC = () => {
	const { t } = useTranslation();
	const { id } = useParams();
	const { currentGame, hasError: hasGameError, isLoading: isGameLoading } = useGameFetch(id);
	const { hasError: hasLevelsError, isLoading: isLevelsLoading, levels } = useLevelsFetch(id);

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

	const isPageLoading = isGameLoading || isLevelsLoading;

	if (isPageLoading) {
		return <Loader variant="page" />;
	}

	if (hasGameError) {
		return renderError(t("games.content.loadError"));
	}

	if (!currentGame) {
		return renderError(t("games.content.notFound"));
	}

	return <GameLevelsPreview game={currentGame} hasError={hasLevelsError} levels={levels} />;
};

export { GameContentPage };
