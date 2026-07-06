import { Link } from "react-router-dom";

import { Icon } from "~/libs/components/components";
import { getValidClassNames } from "~/libs/helpers/helpers";

import buttonStyles from "../button/styles.module.css";
import { type ButtonLinkProperties } from "./types";

/**
 * A router link styled as a Button. Use instead of wrapping a `<Button>` in a
 * `<Link>`, which produces an invalid nested `<a><button>` and two focusable
 * elements. Shares the Button stylesheet so the appearance stays identical.
 */
const ButtonLink: React.FC<ButtonLinkProperties> = ({
	children,
	className = "",
	fullWidth = false,
	iconLeft,
	iconRight,
	size = "md",
	variant = "primary",
	...restProperties
}) => {
	const linkClasses = getValidClassNames(
		buttonStyles["button"],
		buttonStyles[`button--${variant}`],
		buttonStyles[`button--${size}`],
		fullWidth && buttonStyles["button--full-width"],
		className
	);

	return (
		<Link {...restProperties} className={linkClasses}>
			{iconLeft && (
				<span
					className={getValidClassNames(
						buttonStyles["button__icon"],
						buttonStyles["button__icon--left"]
					)}
				>
					<Icon name={iconLeft} />
				</span>
			)}

			<span className={buttonStyles["button__content"]}>{children}</span>

			{iconRight && (
				<span
					className={getValidClassNames(
						buttonStyles["button__icon"],
						buttonStyles["button__icon--right"]
					)}
				>
					<Icon name={iconRight} />
				</span>
			)}
		</Link>
	);
};

export { ButtonLink };
