/** `null` means the counter is not enforced — never a large number, so every reader branches on it instead of comparing. */
type EntitlementLimits = {
	completed: null | number;
	started: null | number;
};

export { type EntitlementLimits };
