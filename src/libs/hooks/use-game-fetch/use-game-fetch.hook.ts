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
	const currentGame = useAppSelector((state) => state.games.currentGame);
	const currentGameStatus = useAppSelector((state) => state.games.currentGameStatus);

	const fetchGame = useCallback(() => {
		if (id) {
			void dispatch(gamesActions.getById(id));
		}
	}, [dispatch, id]);

	useLanguageSync(fetchGame);

	useEffect(() => {
		if (!id || currentGame?.id === id) {
			return;
		}

		fetchGame();
	}, [id, currentGame?.id, fetchGame]);

	const matchedGame = currentGame?.id === id ? currentGame : null;
	const isLoading = matchedGame === null && currentGameStatus !== DataStatus.REJECTED;

	return {
		currentGame: matchedGame,
		isLoading,
	};
};

export { useGameFetch };
