import { Link } from "~/libs/components/components";
import { AppRoute } from "~/libs/enums/enums";
import { configureString, getValidClassNames } from "~/libs/helpers/helpers";
import { type GameDescriptionDto } from "~/libs/types/types";

import styles from "./styles.module.css";

type Properties = {
	game: GameDescriptionDto;
};

const GameCard: React.FC<Properties> = ({ game }) => {
	const gamePath = configureString(AppRoute.GAME_CONTENT, {
		id: game.id.toString(),
	});

	return (
		<Link className={getValidClassNames(styles["game-card"])} to={gamePath}>
			<img
				alt={game.title}
				className={getValidClassNames(styles["game-card__image"])}
				src={game.icon_url}
			/>
			<div className={getValidClassNames(styles["game-card__content"])}>
				<h2 className={getValidClassNames(styles["game-card__title"])}>{game.title}</h2>
				<p className={getValidClassNames(styles["game-card__description"])}>{game.description}</p>
			</div>
		</Link>
	);
};

export { GameCard };
