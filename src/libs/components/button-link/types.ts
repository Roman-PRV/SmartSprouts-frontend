import { type LinkProps } from "react-router-dom";

import { type IconName } from "~/libs/types/types";

type ButtonLinkProperties = LinkProps & {
	fullWidth?: boolean;
	iconLeft?: IconName;
	iconRight?: IconName;
	size?: ButtonLinkSize;
	variant?: ButtonLinkVariant;
};

type ButtonLinkSize = "lg" | "md" | "sm";

type ButtonLinkVariant = "danger" | "ghost" | "primary" | "secondary";

export { type ButtonLinkProperties };
