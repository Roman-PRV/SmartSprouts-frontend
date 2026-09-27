/**
 * What both consent endpoints answer with. A refusal is reported rather than
 * assumed: an acceptance already on record for the same version outranks it,
 * so refusing does not always leave the account restricted.
 */
type ConsentStateResponseDto = {
	consent_current: boolean;
	consent_declined: boolean;
};

export { type ConsentStateResponseDto };
