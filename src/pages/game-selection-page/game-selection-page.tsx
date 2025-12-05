import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppDispatch, useAppSelector, useEffect } from "~/libs/hooks/hooks";
import { actions as gamesActions } from "~/modules/games/games";

import { GameCard } from "./game-card";
import styles from "./styles.module.css";

const GameSelectionPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const { games } = useAppSelector((state) => state.games);

	useEffect(() => {
		void dispatch(gamesActions.getAllGames());
	}, [dispatch]);

	return (
		<div className={getValidClassNames(styles["container"])}>
			<header className={getValidClassNames(styles["header"])}>
				<h1 className={getValidClassNames(styles["title"])}>Choose a game</h1>
				<div className={getValidClassNames(styles["controls"])}></div>
			</header>

			<main aria-live="polite" className={getValidClassNames(styles["grid"])}>
				{games.length === EMPTY_ARRAY_LENGTH ? (
					<div className={getValidClassNames(styles["no-games"])}>
						No games available at the moment.
					</div>
				) : (
					games.map((game) => <GameCard game={game} key={game.id} />)
				)}
			</main>
		</div>
	);
};

export { GameSelectionPage };
