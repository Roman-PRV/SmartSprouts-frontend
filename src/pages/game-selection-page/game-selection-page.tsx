import {
	useAppDispatch,
	useCallback,
	useEffect,
	useLanguageSync,
	useTranslation,
} from "~/libs/hooks/hooks";
import { actions as gamesActions } from "~/modules/games/games";

import { GameSelectionList } from "./game-selection-list";
import styles from "./styles.module.css";

const GameSelectionPage: React.FC = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const fetchGames = useCallback(() => {
		void dispatch(gamesActions.getAllGames());
	}, [dispatch]);

	useLanguageSync(fetchGames);

	useEffect(() => {
		fetchGames();
	}, [fetchGames]);

	return (
		<div className={styles["game-selection-page__container"]}>
			<header className={styles["game-selection-page__header"]}>
				<h1 className={styles["game-selection-page__title"]}>{t("games.selection.title")}</h1>
			</header>

			<main aria-live="polite" className={styles["game-selection-page__grid"]}>
				<GameSelectionList />
			</main>
		</div>
	);
};

export { GameSelectionPage };
