import { GameLevelsPreview } from "~/libs/components/game-levels-preview/game-levels-preview";
import {
	useAppDispatch,
	useEffect,
	useGameFetch,
	useParams,
	useTranslation,
} from "~/libs/hooks/hooks";
import { actions as gamesActions } from "~/modules/games/games";

import styles from "./styles.module.css";

const GameContentPage: React.FC = () => {
	const { t } = useTranslation();
	const { id } = useParams();
	const dispatch = useAppDispatch();

	const { currentGame, isLoading: isGameLoading } = useGameFetch(id);

	useEffect(() => {
		return (): void => {
			dispatch(gamesActions.clearCurrentGame());
		};
	}, [dispatch]);

	if (!id) {
		return (
			<div className={styles["game-content-page__loading-container"]}>
				<h1>{t("games.content.invalidId")}</h1>
			</div>
		);
	}

	if (isGameLoading) {
		return (
			<div className={styles["game-content-page__loading-container"]}>
				<h1>{t("games.content.loading")}</h1>
			</div>
		);
	}

	if (!currentGame) {
		return (
			<div className={styles["game-content-page__loading-container"]}>
				<h1>{t("games.content.notFound")}</h1>
			</div>
		);
	}

	return (
		<div>
			<GameLevelsPreview game={currentGame} />
		</div>
	);
};

export { GameContentPage };
