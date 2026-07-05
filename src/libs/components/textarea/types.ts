type TextareaProperties = {
	className?: string;
	disabled?: boolean;
	error?: string | undefined;
	id?: string;
	label?: string;
	name: string;
	onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
	onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	placeholder?: string;
	required?: boolean;
	rows?: number;
	value?: string;
};

export { type TextareaProperties };
