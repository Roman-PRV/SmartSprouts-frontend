import { type User } from "./user.type";

type LoginResponseDto = {
	access_token: string;
	user: User;
};

export { type LoginResponseDto };
