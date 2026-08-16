import { toast } from "sonner";

import { i18n } from "~/libs/modules/localization/localization";
import { storage, StorageKey } from "~/libs/modules/storage/storage";
import { sessionExpired } from "~/modules/auth/auth";

type Dependencies = {
	dispatch: (action: ReturnType<typeof sessionExpired>) => void;
	getIsAuthenticated: () => boolean;
};

/**
 * Builds the handler run when an authenticated request is rejected with 401:
 * clears the token and resets the store, and notifies the user only if a live
 * session actually expired (a stale token at bootstrap is cleared silently).
 */
const createUnauthorizedHandler =
	({ dispatch, getIsAuthenticated }: Dependencies) =>
		(): void => {
			const wasAuthenticated = getIsAuthenticated();

			void storage.drop(StorageKey.TOKEN);
			dispatch(sessionExpired());

			if (wasAuthenticated) {
				toast.info(i18n.t("auth.sessionExpired"));
			}
		};

export { createUnauthorizedHandler };
