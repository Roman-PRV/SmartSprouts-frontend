import { type User } from "./user.type";

type LoginResponseDto = {
	access_token: string;
	consent_current: boolean;
	/** Only meaningful while `consent_current` is false: refused, as opposed to never answered. */
	consent_declined: boolean;
	user: User;
};

export { type LoginResponseDto };
