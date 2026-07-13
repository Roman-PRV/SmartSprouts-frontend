import { useEffect } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Toaster } from "sonner";

import { Loader } from "~/libs/components/components";
import { DataStatus } from "~/libs/enums/enums";
import { useAppDispatch, useAppSelector } from "~/libs/hooks/hooks";
import { getAuthenticatedUser } from "~/modules/auth/auth";

const App: React.FC = () => {
	const dispatch = useAppDispatch();
	const { dataStatus, user } = useAppSelector(({ auth }) => auth);

	useEffect(() => {
		if (user) {
			return;
		}

		void dispatch(getAuthenticatedUser());
	}, [dispatch, user]);

	const isBootstrapping =
		!user && (dataStatus === DataStatus.IDLE || dataStatus === DataStatus.PENDING);

	if (isBootstrapping) {
		return <Loader variant="overlay" />;
	}

	return (
		<>
			<Outlet />
			<ScrollRestoration />
			<Toaster position="top-right" richColors />
		</>
	);
};

export { App };
