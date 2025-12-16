import { type IconName } from "~/libs/types/types";

type ButtonProperties = {
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
	fullWidth?: boolean;
	iconLeft?: IconName;
	iconRight?: IconName;
	isLoading?: boolean;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	size?: ButtonSize;
	type?: ButtonType;
	variant?: ButtonVariant;
};

type ButtonSize = "lg" | "md" | "sm";

type ButtonType = "button" | "reset" | "submit";

type ButtonVariant = "danger" | "ghost" | "primary" | "secondary";

export { type ButtonProperties, type ButtonSize, type ButtonType, type ButtonVariant };
