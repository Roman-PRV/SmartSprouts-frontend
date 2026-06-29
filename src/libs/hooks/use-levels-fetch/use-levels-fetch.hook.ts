import { useFetchById } from "~/libs/hooks/use-fetch-by-id/use-fetch-by-id.hook";
import { type LevelDescriptionDto } from "~/libs/types/types";
import { getLevelsList } from "~/modules/games/slices/actions";

type UseLevelsFetchReturn = {
	hasError: boolean;
	isLoading: boolean;
	levels: LevelDescriptionDto[] | null;
};

const useLevelsFetch = (id: string | undefined): UseLevelsFetchReturn => {
	const { data, hasError, isLoading } = useFetchById<LevelDescriptionDto[]>({
		createFetch: getLevelsList,
		id,
		// Level progress changes after a player completes a level; refetch on
		// revisit so the frames reflect the latest attempt.
		revalidateOnMount: true,
		selectData: (state) => state.games.currentGameLevels,
		selectLoadedId: (state) => state.games.currentLevelsGameId,
		selectStatus: (state) => state.games.levelsStatus,
	});

	return {
		hasError,
		isLoading,
		levels: data,
	};
};

export { useLevelsFetch };
