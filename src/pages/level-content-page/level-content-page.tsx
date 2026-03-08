import { FallbackMessage } from "~/libs/components/components";
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
		return <FallbackMessage message={t("games.level.invalidId")} />;
	}

	if (!levelId) {
		return <FallbackMessage message={t("games.level.noLevel")} />;
	}

	if (isGameLoading) {
		return <FallbackMessage message={t("games.level.loading")} />;
	}

	if (!currentGame) {
		return <FallbackMessage message={t("games.level.notFound")} />;
	}

	const LevelComponent = getLevelComponent(currentGame.key);

	if (!LevelComponent) {
		return <FallbackMessage message={t("games.level.unsupportedType", { key: currentGame.key })} />;
	}

	return (
		<div className={styles["page"]}>
			<header className={styles["page__header"]}>
				<h1 className={styles["page__title"]}>
					{t("games.level.title", { levelId, title: currentGame.title })}
				</h1>
			</header>

			<main className={styles["page__content"]}>
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
