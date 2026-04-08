import { type ComponentPropsWithoutRef } from "react";

import { type IconName } from "~/libs/types/types";

/**
 * Properties for the Button component.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button variant="primary" onClick={handleClick}>
 *   Click Me
 * </Button>
 *
 * // With icons and loading state
 * <Button
 *   variant="primary"
 *   iconLeft="login"
 *   isLoading={isSubmitting}
 *   fullWidth
 * >
 *   Sign In
 * </Button>
 * ```
 */

type ButtonProperties = ComponentPropsWithoutRef<"button"> & {
	/** Whether the button should take up the full width of its container */
	fullWidth?: boolean;

	/** Icon name to display on the left side of the button text */
	iconLeft?: IconName;

	/** Icon name to display on the right side of the button text */
	iconRight?: IconName;

	/**
	 * Whether the button is in a loading state.
	 * When true, displays a spinner and disables interaction.
	 */
	isLoading?: boolean;

	/** Size variant of the button. Defaults to "md" */
	size?: ButtonSize;

	/** Visual style variant of the button. Defaults to "primary" */
	variant?: ButtonVariant;
};
/**
 * Size variants for the Button component.
 * - `sm`: Small button with reduced padding and font size
 * - `md`: Medium button (default size)
 * - `lg`: Large button with increased padding and font size
 */
type ButtonSize = "lg" | "md" | "sm";

/**
 * HTML button type attribute values.
 * - `button`: Standard button (default)
 * - `submit`: Submit button for forms
 * - `reset`: Reset button for forms
 */
type ButtonType = "button" | "reset" | "submit";

/**
 * Visual style variants for the Button component.
 * - `primary`: Main action button with accent color
 * - `secondary`: Alternative action button with neutral styling
 * - `danger`: Destructive action button with red color
 * - `ghost`: Minimal button with transparent background
 * - `unstyled`: No default visual styling; use when fully customizing appearance via external styles
 */
type ButtonVariant = "danger" | "ghost" | "primary" | "secondary" | "unstyled";

export { type ButtonProperties, type ButtonSize, type ButtonType, type ButtonVariant };
