type User = {
	email: string;
	/** False for Google-only accounts that never set a local password. */
	has_password: boolean;
	id: number;
	is_admin: boolean;
	name: string;
};

export { type User };
