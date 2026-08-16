import { type User } from "./user.type";

type AuthenticatedUserResponseDto = {
	consent_current: boolean;
	user: User;
};

export { type AuthenticatedUserResponseDto };
