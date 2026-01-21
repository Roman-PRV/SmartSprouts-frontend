import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "~/libs/hooks/hooks.js";

const ProtectedRoute: React.FC = () => {
	const { isAuthenticated } = useAppSelector(({ auth }) => auth);

	if (!isAuthenticated) {
		return <Navigate replace to="/login" />;
	}

	return <Outlet />;
};

export { ProtectedRoute };
