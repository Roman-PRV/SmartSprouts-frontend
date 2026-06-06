import { Navigate, Outlet } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums";
import { useAppSelector } from "~/libs/hooks/hooks";

const RequireAdmin: React.FC = () => {
	const user = useAppSelector(({ auth }) => auth.user);

	if (!user || !user.is_admin) {
		return <Navigate replace to={AppRoute.ROOT} />;
	}

	return <Outlet />;
};

export { RequireAdmin };
