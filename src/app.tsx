import { Outlet, ScrollRestoration } from "react-router-dom";
import { Toaster } from "sonner";

import { Loader } from "~/libs/components/components";
import { DataStatus } from "~/libs/enums/enums";
import { useAppDispatch, useAppSelector, useEffect, useRef } from "~/libs/hooks/hooks";
import { getAuthenticatedUser } from "~/modules/auth/auth";

const App: React.FC = () => {
	const dispatch = useAppDispatch();
	const dataStatus = useAppSelector(({ auth }) => auth.dataStatus);
	const user = useAppSelector(({ auth }) => auth.user);

	const didBootstrap = useRef(false);

	useEffect(() => {
		if (user) {
			return;
		}

		void dispatch(getAuthenticatedUser()).finally(() => {
			didBootstrap.current = true;
		});
	}, [dispatch, user]);

	// The overlay loader is only for the first session determination. A live
	// reset (logout/expiry) also drops the store to IDLE with no user, but by
	// then we've bootstrapped — ProtectedRoute redirects without a full-screen
	// flash. The ref survives re-renders; a coincident store change drives the
	// render that clears the loader.
	const isBootstrapping =
		!didBootstrap.current && !user && dataStatus !== DataStatus.REJECTED;

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
