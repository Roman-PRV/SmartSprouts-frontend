import { FallbackMessage } from "~/libs/components/components";
import { GameLevelsPreview } from "~/libs/components/game-levels-preview/game-levels-preview";
import {
	useAppDispatch,
	useEffect,
	useGameFetch,
	useParams,
	useTranslation,
} from "~/libs/hooks/hooks";
import { actions as gamesActions } from "~/modules/games/games";

const GameContentPage: React.FC = () => {
	const { t } = useTranslation();
	const { id } = useParams();
	const dispatch = useAppDispatch();

	const { currentGame, isLoading: isGameLoading } = useGameFetch(id);

	useEffect(() => {
		return (): void => {
			dispatch(gamesActions.clearCurrentGame());
		};
	}, [dispatch]);

	if (!id) {
		return <FallbackMessage message={t("games.content.invalidId")} />;
	}

	if (isGameLoading) {
		return <FallbackMessage message={t("games.content.loading")} />;
	}

	if (!currentGame) {
		return <FallbackMessage message={t("games.content.notFound")} />;
	}

	return <GameLevelsPreview game={currentGame} />;
};

export { GameContentPage };
