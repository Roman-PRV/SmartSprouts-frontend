import { type User } from "./user.type";

type LoginResponseDto = {
	access_token: string;
	consent_current: boolean;
	user: User;
};

export { type LoginResponseDto };
