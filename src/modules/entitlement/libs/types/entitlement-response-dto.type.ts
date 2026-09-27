import { type ValueOf } from "~/libs/types/types";

import { type TierKey } from "../enums/enums";
import { type EntitlementLimits } from "./entitlement-limits.type";
import { type EntitlementSubscription } from "./entitlement-subscription.type";
import { type EntitlementTier } from "./entitlement-tier.type";

type EntitlementResponseDto = {
	currency: string;
	/** Unlimited granted without payment. Suppresses every purchase entry point. */
	is_exempt: boolean;
	limits: EntitlementLimits;
	purchasing_enabled: boolean;
	/** Advisory for display only: the server is authoritative, so a stale value must never gate the interface. */
	remaining: EntitlementLimits;
	/** UTC. Rendering it in the viewer's time is the client's job. */
	resets_at: string;
	subscription: EntitlementSubscription | null;
	/** `unlimited` for an exempt account too — they play identically. */
	tier: ValueOf<typeof TierKey>;
	/** The whole catalogue in ladder order. The client holds no copy of allowances or prices. */
	tiers: EntitlementTier[];
};

export { type EntitlementResponseDto };
