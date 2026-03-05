import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppDispatch, useEffect, useGameFetch, useParams } from "~/libs/hooks/hooks";
import { actions as gamesActions } from "~/modules/games/games";

import { getLevelComponent } from "./level-component-selector";
import styles from "./styles.module.css";

const LevelContentPage: React.FC = () => {
	const { id, levelId } = useParams();
	const dispatch = useAppDispatch();

	const { currentGame, isLoading: isGameLoading } = useGameFetch(id);

	useEffect(() => {
		return (): void => {
			dispatch(gamesActions.clearCurrentGame());
		};
	}, [dispatch]);

	if (!id) {
		return (
			<div className={getValidClassNames(styles["loading-container"])}>
				<h1>Invalid or missing game ID.</h1>
			</div>
		);
	}

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

	const LevelComponent = getLevelComponent(currentGame.key);

	if (!LevelComponent) {
		return (
			<div className={getValidClassNames(styles["loading-container"])}>
				<h1>Unsupported game type: {currentGame.key}</h1>
			</div>
		);
	}

	if (!levelId) {
		return (
			<div className={getValidClassNames(styles["loading-container"])}>
				<h1>No level selected</h1>
			</div>
		);
	}

	return (
		<div className={getValidClassNames(styles["page"])}>
			<header className={getValidClassNames(styles["page__header"])}>
				<h1 className={getValidClassNames(styles["page__title"])}>
					Level {levelId} — {currentGame.title}
				</h1>
			</header>

			<main className={getValidClassNames(styles["page__content"])}>
				<LevelComponent
					game={currentGame}
					key={`${currentGame.id}-${levelId}`}
					levelId={Number(levelId)}
				/>
			</main>
		</div>
	);
};

export { LevelContentPage };
