import { type User } from "./user.type";

type RegisterResponseDto = {
	access_token: string;
	consent_current: boolean;
	message?: string;
	token_type?: string;
	user: User;
};

export { type RegisterResponseDto };
