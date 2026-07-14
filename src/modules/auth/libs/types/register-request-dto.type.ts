type RegisterRequestDto = {
	accepted_terms: boolean;
	email: string;
	name: string;
	password: string;
	password_confirmation: string;
};

export { type RegisterRequestDto };
