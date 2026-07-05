import { forwardRef, useId } from "react";

import { getValidClassNames } from "~/libs/helpers/helpers";

import styles from "./styles.module.css";
import { type TextareaProperties } from "./types";

const DEFAULT_ROWS = 4;

/** Multi-line counterpart to Input; forwards its ref so it pairs with react-hook-form's `register`. */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProperties>(
	(
		{
			className = "",
			disabled = false,
			error = null,
			id,
			label,
			name,
			onBlur,
			onChange,
			placeholder,
			required = false,
			rows = DEFAULT_ROWS,
			value,
		},
		reference
	) => {
		const reactId = useId();
		const textareaId = id || reactId;
		const errorId = `${textareaId}-error`;

		const hasError = Boolean(error);

		const wrapperClasses = getValidClassNames(styles["textarea-wrapper"], className);

		const textareaClasses = getValidClassNames(
			styles["textarea"],
			hasError && styles["textarea--error"],
			disabled && styles["textarea--disabled"]
		);

		return (
			<div className={wrapperClasses}>
				{label && (
					<label className={styles["textarea-label"]} htmlFor={textareaId}>
						{label}
						{required && <span className={styles["textarea-label__required"]}> *</span>}
					</label>
				)}

				<textarea
					aria-describedby={hasError ? errorId : undefined}
					aria-invalid={hasError}
					aria-required={required}
					className={textareaClasses}
					disabled={disabled}
					id={textareaId}
					name={name}
					onBlur={onBlur}
					onChange={onChange}
					placeholder={placeholder}
					ref={reference}
					required={required}
					rows={rows}
					value={value}
				/>

				{hasError && (
					<span className={styles["textarea-error"]} id={errorId} role="alert">
						{error}
					</span>
				)}
			</div>
		);
	}
);

Textarea.displayName = "Textarea";

export { Textarea };
