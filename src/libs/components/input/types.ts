import { type IconName } from "~/libs/types/types";

type InputProperties = {
	className?: string;
	disabled?: boolean;
	error?: string | undefined;
	iconLeft?: IconName;
	iconRight?: IconName;
	id?: string;
	label?: string;
	name: string;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	placeholder?: string;
	required?: boolean;
	size?: InputSize;
	type?: InputType;
	value?: string;
};

type InputSize = "md" | "sm";

type InputType = "email" | "number" | "password" | "search" | "text";

export { type InputProperties, type InputSize };
