import { useId } from "react";

import { Icon } from "~/libs/components/components";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useCallback } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";
import { type InputProperties } from "./types";

/**
 * Universal Input component with consistent styling, validation states, and behavior.
 *
 * Features:
 * - Multiple input types (text, email, password, number, search)
 * - Visual states (default, focus, error, disabled)
 * - Icon support (left and right)
 * - Full accessibility (ARIA attributes, label association)
 * - Error message display
 * - Responsive design
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Input
 *   value={name}
 *   onChange={setName}
 *   label="Full Name"
 *   placeholder="Enter your name"
 * />
 *
 * // With validation error
 * <Input
 *   type="email"
 *   value={email}
 *   onChange={setEmail}
 *   label="Email"
 *   error={emailError}
 *   required
 * />
 *
 * // With icons
 * <Input
 *   type="search"
 *   value={query}
 *   onChange={setQuery}
 *   placeholder="Search..."
 *   iconLeft="search"
 * />
 *
 * // Password input
 * <Input
 *   type="password"
 *   value={password}
 *   onChange={setPassword}
 *   label="Password"
 *   required
 * />
 * ```
 */
const Input: React.FC<InputProperties> = ({
	className = "",
	disabled = false,
	error = null,
	iconLeft,
	iconRight,
	id,
	label,
	name,
	onBlur,
	onChange,
	placeholder,
	required = false,
	type = "text",
	value,
}) => {
	const reactId = useId();
	const inputId = id || reactId;
	const errorId = `${inputId}-error`;

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>): void => {
			onChange(event.target.value);
		},
		[onChange]
	);

	const handleBlur = useCallback((): void => {
		if (onBlur) {
			onBlur();
		}
	}, [onBlur]);

	const hasError = Boolean(error);

	const wrapperClasses = getValidClassNames(
		styles["input-wrapper"],
		disabled && styles["input-wrapper--disabled"],
		className
	);

	const inputClasses = getValidClassNames(
		styles["input"],
		hasError && styles["input--error"],
		disabled && styles["input--disabled"],
		iconLeft && styles["input--with-icon-left"],
		iconRight && styles["input--with-icon-right"]
	);

	return (
		<div className={wrapperClasses}>
			{label && (
				<label className={styles["input-label"]} htmlFor={inputId}>
					{label}
					{required && <span className={styles["input-label__required"]}> *</span>}
				</label>
			)}

			<div className={styles["input-container"]}>
				{iconLeft && (
					<span className={getValidClassNames(styles["input-icon"], styles["input-icon--left"])}>
						<Icon name={iconLeft} />
					</span>
				)}

				<input
					aria-describedby={hasError ? errorId : undefined}
					aria-invalid={hasError}
					aria-required={required}
					className={inputClasses}
					disabled={disabled}
					id={inputId}
					name={name}
					onBlur={handleBlur}
					onChange={handleChange}
					placeholder={placeholder}
					required={required}
					type={type}
					value={value}
				/>

				{iconRight && (
					<span className={getValidClassNames(styles["input-icon"], styles["input-icon--right"])}>
						<Icon name={iconRight} />
					</span>
				)}
			</div>

			{hasError && (
				<span className={styles["input-error"]} id={errorId} role="alert">
					{error}
				</span>
			)}
		</div>
	);
};

export { Input };
