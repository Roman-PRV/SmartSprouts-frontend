type User = {
	email: string;
	/** Picks the deletion confirmation UI: password prompt vs emailed one-time code. */
	has_password: boolean;
	id: number;
	is_admin: boolean;
	name: string;
};

export { type User };
