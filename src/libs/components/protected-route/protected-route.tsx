import { Navigate, Outlet } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums.js";
import { useAppSelector } from "~/libs/hooks/hooks.js";

const ProtectedRoute: React.FC = () => {
	const { isAuthenticated } = useAppSelector(({ auth }) => auth);

	if (!isAuthenticated) {
		return <Navigate replace to={AppRoute.LOGIN} />;
	}

	return <Outlet />;
};

export { ProtectedRoute };
