import { useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppDispatch, useAppSelector } from "~/libs/hooks/hooks";
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

	const previousGameIdReference = useRef<null | string>(null);
	const levelsRequestedForReference = useRef<null | string>(null);

	useEffect(() => {
		if (!gameId) {
			previousGameIdReference.current = null;

			return;
		}

		const previous = previousGameIdReference.current;

		if (previous && previous !== gameId) {
			dispatch(gamesActions.clearCurrentGame());
			levelsRequestedForReference.current = null;
		}

		const currentId = currentGame ? String(currentGame.id) : null;

		if (currentId !== String(gameId) && currentGameStatus !== DataStatus.PENDING) {
			void dispatch(gamesActions.getById(gameId));
		}

		previousGameIdReference.current = String(gameId);
	}, [dispatch, gameId, currentGame, currentGameStatus]);

	useEffect(() => {
		if (!currentGame) {
			return;
		}

		if (!gameId) {
			return;
		}

		if (String(currentGame.id) !== String(gameId)) {
			return;
		}

		if (levelsStatus === DataStatus.PENDING) {
			return;
		}

		const requestedFor = levelsRequestedForReference.current;

		if (requestedFor && String(requestedFor) === String(currentGame.id)) {
			return;
		}

		void dispatch(gamesActions.getLevelsList(currentGame.id));
		levelsRequestedForReference.current = String(currentGame.id);
	}, [dispatch, currentGame, levelsStatus, gameId]);

	const handleRetry = useCallback((): void => {
		if (!currentGame) {
			return;
		}

		if (levelsStatus === DataStatus.PENDING) {
			return;
		}

		levelsRequestedForReference.current = null;
		void dispatch(gamesActions.getLevelsList(currentGame.id));
	}, [dispatch, currentGame, levelsStatus]);

	let content: React.ReactNode;

	if (levelsStatus === DataStatus.PENDING) {
		content = <div className={getValidClassNames(styles["no-content"])}>Loading levels…</div>;
	} else if (levelsStatus === DataStatus.REJECTED) {
		content = (
			<div className={getValidClassNames(styles["no-content"])}>
				<p>Failed to load levels. Please try again.</p>
				<button onClick={handleRetry} type="button">
					Retry
				</button>
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
