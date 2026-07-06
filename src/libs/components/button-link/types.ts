import { type LinkProps } from "react-router-dom";

import { type ButtonSize, type ButtonVariant } from "~/libs/components/button/types";
import { type IconName } from "~/libs/types/types";

type ButtonLinkProperties = LinkProps & {
	fullWidth?: boolean;
	iconLeft?: IconName;
	iconRight?: IconName;
	size?: ButtonSize;
	variant?: Exclude<ButtonVariant, "unstyled">;
};

export { type ButtonLinkProperties };
