import { type User } from "./user.type";

type RegisterResponseDto = {
	access_token: string;
	consent_current: boolean;
	/** Only meaningful while `consent_current` is false: refused, as opposed to never answered. */
	consent_declined: boolean;
	message?: string;
	token_type?: string;
	user: User;
};

export { type RegisterResponseDto };
