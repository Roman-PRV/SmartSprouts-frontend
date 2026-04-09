import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useLanguageSync,
	useTranslation,
} from "~/libs/hooks/hooks";
import { actions as gamesActions } from "~/modules/games/games";

import { GameCard } from "./game-card";
import styles from "./styles.module.css";

const GameSelectionPage: React.FC = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const games = useAppSelector((state) => state.games.games);
	const gamesStatus = useAppSelector((state) => state.games.gamesStatus);

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
				{gamesStatus === DataStatus.FULFILLED && games.length === EMPTY_ARRAY_LENGTH ? (
					<div className={styles["game-selection-page__no-games"]}>
						{t("games.selection.empty")}
					</div>
				) : (
					games.map((game) => <GameCard game={game} key={game.id} />)
				)}
			</main>
		</div>
	);
};

export { GameSelectionPage };
