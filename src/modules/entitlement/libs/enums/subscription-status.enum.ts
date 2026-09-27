const SubscriptionStatus = {
	ACTIVE: "active",
	CANCELLING: "cancelling",
	ENDED: "ended",
	PAST_DUE: "past_due",
} as const;

export { SubscriptionStatus };
