import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "~/libs/hooks/hooks.js";

const GuestRoute: React.FC = () => {
	const { isAuthenticated } = useAppSelector(({ auth }) => auth);

	if (isAuthenticated) {
		return <Navigate replace to="/profile" />;
	}

	return <Outlet />;
};

export { GuestRoute };
