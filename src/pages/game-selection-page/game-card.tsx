import React, { useCallback } from "react";

import { getValidClassNames } from "~/libs/helpers/helpers";
import { type GameDescriptionDto } from "~/types/game-description-dto.type";

import styles from "./styles.module.css";

type Properties = {
	game: GameDescriptionDto;
};

const GameCard: React.FC<Properties> = ({ game }) => {
	const handleClick = useCallback((): void => {}, []);

	return (
		<button className={getValidClassNames(styles["card"])} onClick={handleClick} type="button">
			<img alt={game.title} className={getValidClassNames(styles["image"])} src={game.icon_url} />
			<div className={getValidClassNames(styles["content"])}>
				<h2 className={getValidClassNames(styles["cardTitle"])}>{game.title}</h2>
				<p className={getValidClassNames(styles["description"])}>{game.description}</p>
			</div>
		</button>
	);
};

export { GameCard };
