import { useParams } from "react-router-dom";

import { type GameKey } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppSelector } from "~/libs/hooks/hooks";

import { GamePreviewComponentMap } from "./game-preview-component-map";
import styles from "./styles.module.css";

const GameContentPage: React.FC = () => {
	const { id } = useParams();
	type GameKeyType = (typeof GameKey)[keyof typeof GameKey];
	const currentGame = useAppSelector((state) => state.games.currentGame);

	if (!currentGame) {
		return (
			<div className={getValidClassNames(styles["loading-container"])}>
				<h1>Loading game content...</h1>
			</div>
		);
	}

	const gameKey = currentGame.key as GameKeyType;
	const GamePreviewComponent = GamePreviewComponentMap[gameKey];

	return (
		<h1>
			Game Content Page: {id}
			<GamePreviewComponent game={currentGame} />
		</h1>
	);
};

export { GameContentPage };
