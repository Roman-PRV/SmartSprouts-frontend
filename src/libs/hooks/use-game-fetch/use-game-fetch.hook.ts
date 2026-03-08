import { DataStatus } from "~/libs/enums/enums";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useLanguageSync,
} from "~/libs/hooks/hooks";
import { type GameDescriptionDto } from "~/libs/types/types";
import { actions as gamesActions } from "~/modules/games/games";

type UseGameFetchReturn = {
	currentGame: GameDescriptionDto | null;
	isLoading: boolean;
};

const useGameFetch = (id: string | undefined): UseGameFetchReturn => {
	const dispatch = useAppDispatch();
	const { currentGame, currentGameStatus } = useAppSelector((state) => state.games);

	const isLoading = currentGameStatus === DataStatus.PENDING;

	useLanguageSync(
		useCallback(() => {
			if (id && !isLoading) {
				void dispatch(gamesActions.getById(id));
			}
		}, [dispatch, id, isLoading])
	);

	useEffect(() => {
		const isDataCached = currentGame && currentGame.id === id;

		if (id && !isLoading && !isDataCached) {
			void dispatch(gamesActions.getById(id));
		}
	}, [dispatch, id, currentGame, isLoading]);

	useEffect(() => {
		return (): void => {
			dispatch(gamesActions.clearCurrentGame());
		};
	}, [dispatch]);

	return {
		currentGame,
		isLoading,
	};
};

export { useGameFetch };
