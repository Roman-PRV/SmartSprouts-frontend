type UpdatePasswordRequestDto = {
	current_password: string;
	new_password: string;
	new_password_confirmation: string;
};

export { type UpdatePasswordRequestDto };
