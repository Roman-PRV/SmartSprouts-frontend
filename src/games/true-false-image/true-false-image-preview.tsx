import { useParams } from "react-router-dom";

import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
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
	const levelsStatus = useAppSelector((state) => state.games.levelsStatus);
	const currentGameStatus = useAppSelector((state) => state.games.currentGameStatus);

	useEffect(() => {
		if (!currentGame && gameId) {
			void dispatch(gamesActions.getById(gameId));
		}
	}, [dispatch, currentGame, gameId, currentGameStatus]);

	useEffect(() => {
		if (currentGame && !currentGameLevels) {
			void dispatch(gamesActions.getLevelsList(currentGame.id));
		}
	}, [dispatch, currentGame, currentGameLevels, levelsStatus]);

	let content;

	if (levelsStatus === DataStatus.PENDING) {
		content = <div className={getValidClassNames(styles["no-content"])}>Loading levels…</div>;
	} else if (levelsStatus === DataStatus.REJECTED) {
		content = (
			<div className={getValidClassNames(styles["no-content"])}>
				<p>Failed to load levels. Please try again.</p>
			</div>
		);
	} else if (currentGameLevels && currentGameLevels.length > EMPTY_ARRAY_LENGTH && currentGame) {
		content = (
			<>
				{currentGameLevels.map((level, index) => (
					<LevelPreviewCard game={currentGame} key={level.id} level={level} number={index} />
				))}
			</>
		);
	} else {
		content = (
			<div className={getValidClassNames(styles["no-content"])}>
				No levels available at the moment.
			</div>
		);
	}

	return (
		<div>
			<h2 className={getValidClassNames(styles["game-title"])}>
				Select a level for the TrueFalseImage game
			</h2>
			<main aria-live="polite" className={getValidClassNames(styles["grid"])}>
				{content}
			</main>
		</div>
	);
};

export { TrueFalseImagePreview };
