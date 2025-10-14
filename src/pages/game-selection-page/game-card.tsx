import { Link } from "~/libs/components/components";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { type GameDescriptionDto } from "~/libs/types/types";

import styles from "./styles.module.css";

type Properties = {
	game: GameDescriptionDto;
};

const GameCard: React.FC<Properties> = ({ game }) => {
	return (
		<Link className={getValidClassNames(styles["card"])} to={`/games/${game.id}`}>
			<img alt={game.title} className={getValidClassNames(styles["image"])} src={game.icon_url} />
			<div className={getValidClassNames(styles["content"])}>
				<h2 className={getValidClassNames(styles["cardTitle"])}>{game.title}</h2>
				<p className={getValidClassNames(styles["description"])}>{game.description}</p>
			</div>
		</Link>
	);
};

export { GameCard };
