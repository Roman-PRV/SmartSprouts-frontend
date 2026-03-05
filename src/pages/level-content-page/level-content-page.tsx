import { getValidClassNames } from "~/libs/helpers/helpers";
import {
	useAppDispatch,
	useEffect,
	useGameFetch,
	useParams,
	useTranslation,
} from "~/libs/hooks/hooks";
import { actions as gamesActions } from "~/modules/games/games";

import { getLevelComponent } from "./level-component-selector";
import styles from "./styles.module.css";

const LevelContentPage: React.FC = () => {
	const { t } = useTranslation();
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
				<h1>{t("games.level.invalidId")}</h1>
			</div>
		);
	}

	if (isGameLoading) {
		return (
			<div className={getValidClassNames(styles["loading-container"])}>
				<h1>{t("games.level.loading")}</h1>
			</div>
		);
	}

	if (!currentGame) {
		return (
			<div className={getValidClassNames(styles["loading-container"])}>
				<h1>{t("games.level.notFound")}</h1>
			</div>
		);
	}

	const LevelComponent = getLevelComponent(currentGame.key);

	if (!LevelComponent) {
		return (
			<div className={getValidClassNames(styles["loading-container"])}>
				<h1>{t("games.level.unsupportedType", { key: currentGame.key })}</h1>
			</div>
		);
	}

	if (!levelId) {
		return (
			<div className={getValidClassNames(styles["loading-container"])}>
				<h1>{t("games.level.noLevel")}</h1>
			</div>
		);
	}

	return (
		<div className={getValidClassNames(styles["page"])}>
			<header className={getValidClassNames(styles["page__header"])}>
				<h1 className={getValidClassNames(styles["page__title"])}>
					{t("games.level.title", { levelId, title: currentGame.title })}
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
