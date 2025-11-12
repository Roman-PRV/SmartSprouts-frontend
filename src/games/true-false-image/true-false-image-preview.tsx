import { useParams } from "react-router-dom";

import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppDispatch, useAppSelector, useEffect } from "~/libs/hooks/hooks";
import { actions as gamesActions } from "~/modules/games/games";

import { LevelPreviewCard } from "./level-preview-card";
import styles from "./styles.module.css";

const TrueFalseImagePreview: React.FC = () => {
	const { id: gameId } = useParams();
	const dispatch = useAppDispatch();

	const currentGame = useAppSelector((state) => state.games.currentGame);
	const currentGameLevels = useAppSelector((state) => state.games.currentGameLevels);

	useEffect(() => {
		if (!currentGame && gameId) {
			void dispatch(gamesActions.getById(gameId));
		}
	}, [dispatch, currentGame, gameId]);

	useEffect(() => {
		if (currentGame && !currentGameLevels) {
			void dispatch(gamesActions.getLevelsList(currentGame.id));
		}
	}, [dispatch, currentGame, currentGameLevels]);

	return (
		<div>
			<h2 className={getValidClassNames(styles["game-title"])}>
				Select a level for the TrueFalseImage game
			</h2>
			<main aria-live="polite" className={getValidClassNames(styles["grid"])}>
				{currentGameLevels && currentGameLevels.length > EMPTY_ARRAY_LENGTH && currentGame ? (
					currentGameLevels.map((level, index) => (
						<LevelPreviewCard game={currentGame} key={level.id} level={level} number={index} />
					))
				) : (
					<div className={getValidClassNames(styles["no-content"])}>
						No levels available at the moment.
					</div>
				)}
			</main>
		</div>
	);
};

export { TrueFalseImagePreview };
