import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { Loader } from "~/libs/components/components";
import { DataStatus } from "~/libs/enums/enums";
import { useAppDispatch, useAppSelector } from "~/libs/hooks/hooks";
import { storage, StorageKey } from "~/libs/modules/storage/storage";
import { getAuthenticatedUser } from "~/modules/auth/auth";

const App: React.FC = () => {
	const dispatch = useAppDispatch();
	const { dataStatus } = useAppSelector(({ auth }) => auth);
	const hasToken = Boolean(storage.get(StorageKey.TOKEN));

	useEffect(() => {
		if (hasToken) {
			void dispatch(getAuthenticatedUser());
		}
	}, [dispatch, hasToken]);

	if ((dataStatus === DataStatus.IDLE || dataStatus === DataStatus.PENDING) && hasToken) {
		return <Loader />;
	}

	return (
		<>
			<Outlet />
		</>
	);
};

export { App };
