import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppDispatch, useAppSelector, useEffect, useRef, useTranslation } from "~/libs/hooks/hooks";
import { actions as gamesActions } from "~/modules/games/games";

import { GameCard } from "./game-card";
import styles from "./styles.module.css";

const GameSelectionPage: React.FC = () => {
	const { i18n, t } = useTranslation();
	const dispatch = useAppDispatch();
	const { games } = useAppSelector((state) => state.games);

	const lastLanguageReference = useRef(i18n.language);

	useEffect(() => {
		void dispatch(gamesActions.getAllGames());
		lastLanguageReference.current = i18n.language;
	}, [dispatch, i18n.language]);

	return (
		<div className={getValidClassNames(styles["game-selection-page__container"])}>
			<header className={getValidClassNames(styles["game-selection-page__header"])}>
				<h1 className={getValidClassNames(styles["game-selection-page__title"])}>
					{t("games.selection.title")}
				</h1>
				<div className={getValidClassNames(styles["game-selection-page__controls"])}></div>
			</header>

			<main aria-live="polite" className={getValidClassNames(styles["game-selection-page__grid"])}>
				{games.length === EMPTY_ARRAY_LENGTH ? (
					<div className={getValidClassNames(styles["game-selection-page__no-games"])}>
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
