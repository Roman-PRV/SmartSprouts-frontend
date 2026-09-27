import { type ValueOf } from "~/libs/types/types";

import { type SubscriptionStatus, type TierKey } from "../enums/enums";

type EntitlementSubscription = {
	cancel_at_period_end: boolean;
	/** End of the paid period. Only an active subscription renews on it — for the other statuses access ends then, or already has. */
	current_period_end: string;
	manage_url: null | string;
	/** Set only while a downgrade is queued; it takes effect at `current_period_end`. */
	pending_tier: null | ValueOf<typeof TierKey>;
	status: ValueOf<typeof SubscriptionStatus>;
};

export { type EntitlementSubscription };
