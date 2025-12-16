import { Icon } from "~/libs/components/components";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useCallback } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";
import { type ButtonProperties } from "./types";

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

	const buttonClasses = getValidClassNames(
		styles["button"],
		styles[`button--${variant}`],
		styles[`button--${size}`],
		fullWidth && styles["button--full-width"],
		isLoading && styles["button--loading"],
		isDisabled && styles["button--disabled"],
		className
	);

	return (
		<button
			aria-busy={isLoading}
			aria-disabled={isDisabled}
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
