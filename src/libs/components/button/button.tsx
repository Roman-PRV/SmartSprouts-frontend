import { Icon } from "~/libs/components/components";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useCallback } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";
import { type ButtonProperties } from "./types";

/**
 * Universal Button component with consistent styling, behavior, and accessibility.
 *
 * Features:
 * - Multiple variants (primary, secondary, danger, ghost)
 * - Three sizes (sm, md, lg)
 * - Loading state with spinner
 * - Icon support (left and right)
 * - Full accessibility (ARIA attributes, keyboard navigation)
 * - Responsive design
 * @example
 * ```tsx
 * // Basic usage
 * <Button variant="primary" onClick={handleSubmit}>
 *   Submit
 * </Button>
 *
 * // With icons
 * <Button variant="secondary" iconLeft="login">
 *   Sign In
 * </Button>
 *
 * // Loading state
 * <Button variant="primary" isLoading>
 *   Processing...
 * </Button>
 *
 * // Full width
 * <Button variant="primary" fullWidth>
 *   Continue
 * </Button>
 *
 * // Form submit button
 * <Button type="submit" variant="primary" disabled={!isValid}>
 *   Save Changes
 * </Button>
 * ```
 */
const Button: React.FC<ButtonProperties> = ({
	children,
	className = "",
	disabled = false,
	fullWidth = false,
	iconLeft,
	iconRight,
	isLoading = false,
	onClick,
	size = "md",
	type = "button",
	variant = "primary",
	...restProperties
}) => {
	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>): void => {
			if (!disabled && !isLoading && onClick) {
				onClick(event);
			}
		},
		[disabled, isLoading, onClick]
	);

	const isDisabled = disabled || isLoading;

	const isUnstyled = variant === "unstyled";

	const buttonClasses = getValidClassNames(
		!isUnstyled && styles["button"],
		!isUnstyled && styles[`button--${variant}`],
		!isUnstyled && styles[`button--${size}`],

		isUnstyled && styles["button--unstyled"],

		fullWidth && styles["button--full-width"],
		isLoading && styles["button--loading"],
		isDisabled && styles["button--disabled"],
		className
	);

	return (
		<button
			{...restProperties}
			aria-busy={isLoading}
			className={buttonClasses}
			disabled={isDisabled}
			onClick={handleClick}
			type={type}
		>
			{isLoading && (
				<span className={getValidClassNames(styles["button__spinner"])} role="status">
					<span className={getValidClassNames(styles["button__spinner-icon"])} />
				</span>
			)}

			{!isLoading && iconLeft && (
				<span className={getValidClassNames(styles["button__icon"], styles["button__icon--left"])}>
					<Icon name={iconLeft} />
				</span>
			)}

			<span className={getValidClassNames(styles["button__content"])}>{children}</span>

			{!isLoading && iconRight && (
				<span className={getValidClassNames(styles["button__icon"], styles["button__icon--right"])}>
					<Icon name={iconRight} />
				</span>
			)}
		</button>
	);
};

export { Button };
