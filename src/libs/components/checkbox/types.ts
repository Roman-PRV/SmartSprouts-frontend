type CheckboxProperties = {
	className?: string;
	disabled?: boolean;
	error?: string | undefined;
	id?: string;
	label: React.ReactNode;
	name: string;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	required?: boolean;
};

export { type CheckboxProperties };
