import { useFetchById } from "~/libs/hooks/use-fetch-by-id/use-fetch-by-id.hook";
import { type GameDescriptionDto } from "~/libs/types/types";
import { getById } from "~/modules/games/slices/actions";

type UseGameFetchReturn = {
	currentGame: GameDescriptionDto | null;
	hasError: boolean;
	isLoading: boolean;
};

const useGameFetch = (id: string | undefined): UseGameFetchReturn => {
	const { data, hasError, isLoading } = useFetchById<GameDescriptionDto>({
		createFetch: getById,
		id,
		selectData: (state) => state.games.currentGame,
		selectLoadedId: (state) => state.games.currentGame?.id ?? null,
		selectStatus: (state) => state.games.currentGameStatus,
	});

	return {
		currentGame: data,
		hasError,
		isLoading,
	};
};

export { useGameFetch };
