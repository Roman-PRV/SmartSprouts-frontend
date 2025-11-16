import { useParams } from "react-router-dom";

import { DataStatus } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppDispatch, useAppSelector, useEffect } from "~/libs/hooks/hooks";
import { actions as gamesActions } from "~/modules/games/games";

import { type GameKeyType, GamePreviewComponentMap } from "./game-preview-component-map";
import styles from "./styles.module.css";

const GameContentPage: React.FC = () => {
	const { id } = useParams();
	const dispatch = useAppDispatch();

	const currentGame = useAppSelector((state) => state.games.currentGame);
	const isGameLoading = useAppSelector(
		(state) => state.games.currentGameStatus === DataStatus.PENDING
	);

	useEffect(() => {
		const isDataCached = currentGame && currentGame.id === id;

		if (id && !isDataCached && !isGameLoading) {
			void dispatch(gamesActions.getById(id));
		}
	}, [dispatch, id, currentGame, isGameLoading]);

	if (isGameLoading) {
		return (
			<div className={getValidClassNames(styles["loading-container"])}>
				<h1>Loading game content...</h1>
			</div>
		);
	}

	if (!currentGame) {
		return (
			<div className={getValidClassNames(styles["loading-container"])}>
				<h1>Game content not found.</h1>
			</div>
		);
	}

	const gameKey = currentGame.key as GameKeyType;
	const GamePreviewComponent = GamePreviewComponentMap[gameKey];

	return (
		<div>
			<h1>Game Content Page: {id}</h1>
			<GamePreviewComponent game={currentGame} />
		</div>
	);
};

export { GameContentPage };
