import { useCallback } from "react";

import { useAppDispatch, useNavigate } from "~/libs/hooks/hooks";
import { logout } from "~/modules/auth/slices/actions";

const useLogout = (): { logout: () => void } => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleLogout = useCallback((): void => {
		const performLogout = async (): Promise<void> => {
			try {
				await dispatch(logout()).unwrap();
			} finally {
				await navigate("/login");
			}
		};

		void performLogout();
	}, [dispatch, navigate]);

	return { logout: handleLogout };
};

export { useLogout };
