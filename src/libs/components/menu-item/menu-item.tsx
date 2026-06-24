import { NavLink } from "react-router-dom";

import { getValidClassNames } from "~/libs/helpers/helpers";
import { useCallback } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";

type BaseProperties = {
	children: React.ReactNode;
};

type ButtonProperties = BaseProperties & {
	ariaLabel?: string;
	onClick: () => void;
};

type LinkProperties = BaseProperties & {
	end?: boolean;
	to: string;
};

type Properties = ButtonProperties | LinkProperties;

const isLinkProperties = (properties: Properties): properties is LinkProperties =>
	"to" in properties;

/**
 * Shared menu entry styled as a plain brand-coloured text link. Renders a
 * NavLink (with active state) when given `to`, or a button when given `onClick`.
 * Used by both the player navigation and the admin header so their menus match.
 */
const MenuItem: React.FC<Properties> = (properties) => {
	const getLinkClassName = useCallback(
		({ isActive }: { isActive: boolean }): string =>
			getValidClassNames(
				styles["menu-item"],
				isActive && styles["menu-item--highlighted"],
				isActive && styles["menu-item--active"]
			),
		[]
	);

	if (isLinkProperties(properties)) {
		const { children, end = false, to } = properties;

		return (
			<NavLink className={getLinkClassName} end={end} to={to}>
				{children}
			</NavLink>
		);
	}

	const { ariaLabel, children, onClick } = properties;

	return (
		<button aria-label={ariaLabel} className={styles["menu-item"]} onClick={onClick} type="button">
			{children}
		</button>
	);
};

export { MenuItem };
