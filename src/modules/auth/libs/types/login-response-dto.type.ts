import { type User } from "./user.type.js";

type LoginResponseDto = {
	access_token: string;
	user: User;
};

export { type LoginResponseDto };
