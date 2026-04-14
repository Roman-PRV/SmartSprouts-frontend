import { type IconName } from "~/libs/types/types";

/**
 * Properties for the Input component.
 *
 * @example
 * ```tsx
 * // Basic text input
 * <Input
 *   name="email"
 *   value={email}
 *   onChange={setEmail}
 *   label="Email"
 *   placeholder="Enter your email"
 * />
 *
 * // Password input with error
 * <Input
 *   type="password"
 *   name="password"
 *   value={password}
 *   onChange={setPassword}
 *   label="Password"
 *   error="Password must be at least 8 characters"
 *   required
 * />
 *
 * // Search input with icon
 * <Input
 *   type="search"
 *   name="search"
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   placeholder="Search..."
 *   iconLeft="search"
 * />
 * ```
 */
type InputProperties = {
	/** Additional CSS classes to apply to the input wrapper */
	className?: string;

	/** Whether the input is disabled and cannot be interacted with */
	disabled?: boolean;

	/** Error message to display. When set, input shows error state */
	error?: string | undefined;

	/** Icon name to display on the left side of the input */
	iconLeft?: IconName;

	/** Icon name to display on the right side of the input */
	iconRight?: IconName;

	/** Unique identifier for the input element */
	id?: string;

	/** Label text displayed above the input */
	label?: string;

	/** Name attribute for the input (useful for forms) */
	name: string;

	/** Optional callback function called when the input loses focus */
	onBlur?: React.FocusEventHandler<HTMLInputElement>;

	/** Callback function called when the input value changes */
	onChange?: React.ChangeEventHandler<HTMLInputElement>;

	/** Placeholder text displayed when input is empty */
	placeholder?: string;

	/** Whether the input is required (adds visual indicator and aria-required) */
	required?: boolean;

	/** Type of the input field. Defaults to "text" */
	type?: InputType;

	/** Current value of the input */
	value?: string;
};

/**
 * Supported input types for the Input component.
 * - `text`: Standard text input (default)
 * - `email`: Email input with browser validation
 * - `password`: Password input with masked characters
 * - `number`: Numeric input
 * - `search`: Search input with browser-specific styling
 */
type InputType = "email" | "number" | "password" | "search" | "text";

export { type InputProperties };
