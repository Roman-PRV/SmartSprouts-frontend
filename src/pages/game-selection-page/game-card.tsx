import { Link } from "~/libs/components/components";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppDispatch, useCallback } from "~/libs/hooks/hooks";
import { type GameDescriptionDto } from "~/libs/types/types";
import { actions as gamesActions } from "~/modules/games/games";

import styles from "./styles.module.css";

type Properties = {
	game: GameDescriptionDto;
};

const GameCard: React.FC<Properties> = ({ game }) => {
	const dispatch = useAppDispatch();

	const handleCardClick = useCallback(() => {
		dispatch(gamesActions.setCurrentGame(game));
	}, [game, dispatch]);

	return (
		<Link
			className={getValidClassNames(styles["card"])}
			onClick={handleCardClick}
			to={`/games/${game.id}`}
		>
			<img alt={game.title} className={getValidClassNames(styles["image"])} src={game.icon_url} />
			<div className={getValidClassNames(styles["content"])}>
				<h2 className={getValidClassNames(styles["cardTitle"])}>{game.title}</h2>
				<p className={getValidClassNames(styles["description"])}>{game.description}</p>
			</div>
		</Link>
	);
};

export { GameCard };
