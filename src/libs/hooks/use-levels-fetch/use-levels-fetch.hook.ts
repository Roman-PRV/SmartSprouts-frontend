import { useFetchById } from "~/libs/hooks/use-fetch-by-id/use-fetch-by-id.hook";
import { type LevelDescriptionDto } from "~/libs/types/types";
import { getLevelsList } from "~/modules/games/slices/actions";

type UseLevelsFetchReturn = {
	isLoading: boolean;
	levels: LevelDescriptionDto[] | null;
};

const useLevelsFetch = (id: string | undefined): UseLevelsFetchReturn => {
	const { data, isLoading } = useFetchById<LevelDescriptionDto[]>({
		createFetch: getLevelsList,
		id,
		selectData: (state) => state.games.currentGameLevels,
		selectLoadedId: (state) => state.games.currentLevelsGameId,
		selectStatus: (state) => state.games.levelsStatus,
	});

	return {
		isLoading,
		levels: data,
	};
};

export { useLevelsFetch };
