import { GameLevelsPreview } from "~/libs/components/game-levels-preview/game-levels-preview";
import { DataStatus } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import {
	useAppDispatch,
	useAppSelector,
	useEffect,
	useParams,
	useRef,
	useTranslation,
} from "~/libs/hooks/hooks";
import { actions as gamesActions } from "~/modules/games/games";

import styles from "./styles.module.css";

const GameContentPage: React.FC = () => {
	const { i18n, t } = useTranslation();
	const { id } = useParams();

	const dispatch = useAppDispatch();

	const currentGame = useAppSelector((state) => state.games.currentGame);
	const isGameLoading = useAppSelector(
		(state) => state.games.currentGameStatus === DataStatus.PENDING
	);

	const lastLanguageReference = useRef(i18n.language);

	useEffect(() => {
		const isDataCached = currentGame && currentGame.id === id;
		const isLanguageChanged = lastLanguageReference.current !== i18n.language;

		if (id && !isGameLoading && (!isDataCached || isLanguageChanged)) {
			void dispatch(gamesActions.getById(id));
			lastLanguageReference.current = i18n.language;
		}
	}, [dispatch, id, currentGame, isGameLoading, i18n.language]);

	useEffect(() => {
		return (): void => {
			dispatch(gamesActions.clearCurrentGame());
		};
	}, [dispatch, id]);

	if (!id) {
		return (
			<div className={getValidClassNames(styles["game-content-page__loading-container"])}>
				<h1>{t("games.content.invalidId")}</h1>
			</div>
		);
	}

	if (isGameLoading) {
		return (
			<div className={getValidClassNames(styles["game-content-page__loading-container"])}>
				<h1>{t("games.content.loading")}</h1>
			</div>
		);
	}

	if (!currentGame) {
		return (
			<div className={getValidClassNames(styles["game-content-page__loading-container"])}>
				<h1>{t("games.content.notFound")}</h1>
			</div>
		);
	}

	return (
		<div>
			<GameLevelsPreview game={currentGame} />
		</div>
	);
};

export { GameContentPage };
