import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { Loader } from "~/libs/components/components";
import { DataStatus } from "~/libs/enums/enums";
import { useAppDispatch, useAppSelector } from "~/libs/hooks/hooks";
import { getAuthenticatedUser } from "~/modules/auth/auth";

const App: React.FC = () => {
	const dispatch = useAppDispatch();
	const { dataStatus } = useAppSelector(({ auth }) => auth);

	useEffect(() => {
		void dispatch(getAuthenticatedUser());
	}, [dispatch]);

	if (dataStatus === DataStatus.IDLE || dataStatus === DataStatus.PENDING) {
		return <Loader variant="overlay" />;
	}

	return (
		<>
			<Outlet />
		</>
	);
};

export { App };
