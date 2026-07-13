import { forwardRef, useId } from "react";

import { getValidClassNames } from "~/libs/helpers/helpers";

import styles from "./styles.module.css";
import { type CheckboxProperties } from "./types";

/** Single checkbox with a rich (ReactNode) label; forwards its ref so it pairs with react-hook-form's `register`. */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProperties>(
	(
		{ className = "", disabled = false, error, id, label, name, onBlur, onChange, required = false },
		reference
	) => {
		const reactId = useId();
		const checkboxId = id || reactId;
		const errorId = `${checkboxId}-error`;

		const hasError = Boolean(error);

		return (
			<div className={getValidClassNames(styles["checkbox-wrapper"], className)}>
				<div className={styles["checkbox-container"]}>
					<input
						aria-describedby={hasError ? errorId : undefined}
						aria-invalid={hasError}
						aria-required={required}
						className={getValidClassNames(
							styles["checkbox"],
							hasError && styles["checkbox--error"],
							disabled && styles["checkbox--disabled"]
						)}
						disabled={disabled}
						id={checkboxId}
						name={name}
						onBlur={onBlur}
						onChange={onChange}
						ref={reference}
						required={required}
						type="checkbox"
					/>

					<label className={styles["checkbox-label"]} htmlFor={checkboxId}>
						{label}
						{required && <span className={styles["checkbox-label__required"]}> *</span>}
					</label>
				</div>

				{hasError && (
					<span className={styles["checkbox-error"]} id={errorId} role="alert">
						{error}
					</span>
				)}
			</div>
		);
	}
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
