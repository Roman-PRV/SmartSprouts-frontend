import { Navigate, Outlet } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums";
import { useAppSelector } from "~/libs/hooks/hooks";

import { ConsentGate } from "../consent-gate/consent-gate";

const ProtectedRoute: React.FC = () => {
	const isAuthenticated = useAppSelector(({ auth }) => auth.isAuthenticated);
	const consentCurrent = useAppSelector(({ auth }) => auth.consentCurrent);

	if (!isAuthenticated) {
		return <Navigate replace to={AppRoute.LOGIN} />;
	}

	if (!consentCurrent) {
		return <ConsentGate />;
	}

	return <Outlet />;
};

export { ProtectedRoute };
