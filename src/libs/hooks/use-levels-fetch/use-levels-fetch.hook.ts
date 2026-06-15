import { useCallback, useEffect } from "react";

import { DataStatus } from "~/libs/enums/enums";
import { useAppDispatch } from "~/libs/hooks/use-app-dispatch/use-app-dispatch.hook";
import { useAppSelector } from "~/libs/hooks/use-app-selector/use-app-selector.hook";
import { useLanguageSync } from "~/libs/hooks/use-language-sync/use-language-sync.hook";
import { getLevelsList } from "~/modules/games/slices/actions";

type UseLevelsFetchReturn = {
	isLoading: boolean;
};

const useLevelsFetch = (id: string | undefined): UseLevelsFetchReturn => {
	const dispatch = useAppDispatch();
	const levelsStatus = useAppSelector((state) => state.games.levelsStatus);
	const currentLevelsGameId = useAppSelector((state) => state.games.currentLevelsGameId);

	const fetchLevels = useCallback(() => {
		if (id) {
			void dispatch(getLevelsList(id));
		}
	}, [dispatch, id]);

	useLanguageSync(fetchLevels);

	useEffect(() => {
		if (!id || currentLevelsGameId === id) {
			return;
		}

		fetchLevels();
	}, [id, currentLevelsGameId, fetchLevels]);

	const isMatched = id !== undefined && currentLevelsGameId === id;
	const isLoading = !isMatched && levelsStatus !== DataStatus.REJECTED;

	return {
		isLoading,
	};
};

export { useLevelsFetch };
