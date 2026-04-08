import { type User } from "./user.type";

type RegisterResponseDto = {
	access_token: string;
	message?: string;
	token_type?: string;
	user: User;
};

export { type RegisterResponseDto };
