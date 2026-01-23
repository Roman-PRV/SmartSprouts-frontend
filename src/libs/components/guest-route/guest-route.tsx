import { Navigate, Outlet } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums";
import { useAppSelector } from "~/libs/hooks/hooks";

const GuestRoute: React.FC = () => {
	const { isAuthenticated } = useAppSelector(({ auth }) => auth);

	if (isAuthenticated) {
		return <Navigate replace to={AppRoute.PROFILE} />;
	}

	return <Outlet />;
};

export { GuestRoute };
