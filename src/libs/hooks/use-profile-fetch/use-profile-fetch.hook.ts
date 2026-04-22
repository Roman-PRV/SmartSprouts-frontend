import { DataStatus } from "~/libs/enums/enums";
import { useAppDispatch, useAppSelector, useEffect } from "~/libs/hooks/hooks";
import { fetchProfile, type UserProfileDto } from "~/modules/profile/profile";

type UseProfileFetchReturn = {
	data: null | UserProfileDto;
	error: null | string;
	isError: boolean;
	isLoading: boolean;
};

const useProfileFetch = (): UseProfileFetchReturn => {
	const dispatch = useAppDispatch();
	const { dataStatus, error, profile } = useAppSelector(({ profile }) => profile);

	useEffect(() => {
		void dispatch(fetchProfile());
	}, [dispatch]);

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
