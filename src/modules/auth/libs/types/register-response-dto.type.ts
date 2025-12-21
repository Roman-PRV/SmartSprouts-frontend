type RegisterResponseDto = {
	access_token: string;
	message?: string;
	token_type?: string;
	user: User;
};

type User = {
	email: string;
	id: number;
	name: string;
};

export { type RegisterResponseDto, type User };
