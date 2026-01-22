import { Navigate, Outlet } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums.js";
import { useAppSelector } from "~/libs/hooks/hooks.js";

const GuestRoute: React.FC = () => {
	const { isAuthenticated } = useAppSelector(({ auth }) => auth);

	if (isAuthenticated) {
		return <Navigate replace to={AppRoute.PROFILE} />;
	}

	return <Outlet />;
};

export { GuestRoute };
