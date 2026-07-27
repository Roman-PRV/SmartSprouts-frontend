import { toast } from "sonner";

import { isSessionExpiredError } from "../is-session-expired-error/is-session-expired-error.helper";

/**
 * Shows an error toast — unless the failure is an expired session, which the
 * global handler already reports by redirecting to login. Routing catch sites
 * through this keeps the "stay silent on session expiry" rule in one place.
 */
const toastError = (error: unknown, message: string): void => {
	if (isSessionExpiredError(error)) {
		return;
	}

	toast.error(message);
};

export { toastError };
