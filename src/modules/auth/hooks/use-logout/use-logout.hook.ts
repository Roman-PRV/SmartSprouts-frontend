import { useCallback } from "react";

import { AppRoute } from "~/libs/enums/enums";
import { useAppDispatch, useNavigate } from "~/libs/hooks/hooks";
import { logout } from "~/modules/auth/slices/actions";

const useLogout = (): { logout: () => Promise<void> } => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleLogout = useCallback(async (): Promise<void> => {
		try {
			await dispatch(logout()).unwrap();
		} finally {
			await navigate(AppRoute.LOGIN);
		}
	}, [dispatch, navigate]);

	return { logout: handleLogout };
};

export { useLogout };
