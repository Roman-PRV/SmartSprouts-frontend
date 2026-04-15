import { useCallback, useEffect } from "react";

import { DataStatus } from "~/libs/enums/enums";
import { useAppDispatch } from "~/libs/hooks/use-app-dispatch/use-app-dispatch.hook";
import { useAppSelector } from "~/libs/hooks/use-app-selector/use-app-selector.hook";
import { useLanguageSync } from "~/libs/hooks/use-language-sync/use-language-sync.hook";
import { type GameDescriptionDto } from "~/libs/types/types";
import { actions as gamesActions } from "~/modules/games/slices/games";

type UseGameFetchReturn = {
	currentGame: GameDescriptionDto | null;
	isLoading: boolean;
};

const useGameFetch = (id: string | undefined): UseGameFetchReturn => {
	const dispatch = useAppDispatch();
	const { currentGame, currentGameStatus } = useAppSelector((state) => state.games);

	const fetchGame = useCallback(() => {
		if (id) {
			void dispatch(gamesActions.getById(id));
		}
	}, [dispatch, id]);

	useLanguageSync(fetchGame);

	useEffect(() => {
		if (id && currentGameStatus === DataStatus.IDLE) {
			fetchGame();
		}
	}, [id, currentGameStatus, fetchGame]);

	useEffect(() => {
		return (): void => {
			dispatch(gamesActions.clearCurrentGame());
		};
	}, [dispatch]);

	const isLoading =
		currentGameStatus === DataStatus.PENDING || currentGameStatus === DataStatus.IDLE;

	return {
		currentGame,
		isLoading,
	};
};

export { useGameFetch };
