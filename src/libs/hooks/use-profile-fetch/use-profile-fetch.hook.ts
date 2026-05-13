import { useEffect } from "react";

import { DataStatus } from "~/libs/enums/enums";
import { useAppDispatch } from "~/libs/hooks/use-app-dispatch/use-app-dispatch.hook";
import { useAppSelector } from "~/libs/hooks/use-app-selector/use-app-selector.hook";
import { fetchProfile, type UserProfileDto } from "~/modules/profile/profile";

type UseProfileFetchReturn = {
	data: null | UserProfileDto;
	error: null | string;
	isError: boolean;
	isLoading: boolean;
};

const useProfileFetch = (): UseProfileFetchReturn => {
	const dispatch = useAppDispatch();
	const { dataStatus, error, profile } = useAppSelector((state) => state.profile);

	useEffect(() => {
		void dispatch(fetchProfile());
	}, [dispatch]);

	// Intentional: always fetch on mount to ensure data freshness.
	// Handle IDLE as loading to prevent flickering before the first fetch starts
	const isLoading = dataStatus === DataStatus.PENDING || dataStatus === DataStatus.IDLE;
	const isError = dataStatus === DataStatus.REJECTED;

	return {
		data: profile,
		error,
		isError,
		isLoading,
	};
};

export { useProfileFetch };
