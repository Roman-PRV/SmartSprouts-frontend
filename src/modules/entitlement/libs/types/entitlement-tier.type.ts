import { type ValueOf } from "~/libs/types/types";

import { type TierKey } from "../enums/enums";
import { type EntitlementLimits } from "./entitlement-limits.type";

/** Carries no display name: the label comes from the `billing` namespace, keyed by `key`. */
type EntitlementTier = {
	key: ValueOf<typeof TierKey>;
	limits: EntitlementLimits;
	price_minor: number;
};

export { type EntitlementTier };
