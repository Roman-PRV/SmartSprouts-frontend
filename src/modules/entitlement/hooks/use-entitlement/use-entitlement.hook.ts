import { DataStatus } from "~/libs/enums/enums";
import { useAppSelector } from "~/libs/hooks/hooks";
import { type ThunkErrorPayload } from "~/libs/types/types";

import { type EntitlementResponseDto } from "../../libs/types/types";

type UseEntitlementReturn = {
	data: EntitlementResponseDto | null;
	error: null | ThunkErrorPayload;
	/** Nothing to render, and nothing will arrive on its own — offer a retry. */
	isError: boolean;
	isLoading: boolean;
};

/**
 * Reads entitlement state from the store. It does not fetch: the request is
 * dispatched once from the app shell, so mounting the indicator in two places
 * at once cannot turn into two requests.
 *
 * A failed refresh is not an error while the last snapshot is still there — a
 * slightly stale allowance reads better than an empty one. That is why `data`
 * and `isError` are reported rather than the raw status: a caller branching on
 * the status alone would hide exactly the snapshot the slice kept.
 */
const useEntitlement = (): UseEntitlementReturn => {
	const user = useAppSelector(({ auth }) => auth.user);
	const { dataStatus, entitlement, error } = useAppSelector((state) => state.entitlement);

	return {
		data: entitlement,
		error,
		isError: entitlement === null && dataStatus === DataStatus.REJECTED,
		// IDLE counts as loading only where the shell is going to fetch. It guards
		// on a user, so without one nothing is coming and a spinner would never
		// stop — the same predicate is used here so the two cannot drift apart.
		isLoading:
			dataStatus === DataStatus.PENDING ||
			(dataStatus === DataStatus.IDLE && user !== null),
	};
};

export { useEntitlement };
