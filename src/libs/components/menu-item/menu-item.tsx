import { Link } from "react-router-dom";

import { getValidClassNames } from "~/libs/helpers/helpers";
import { useMatch } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";

const ROOT_PATH = "/";

type BaseProperties = {
	children: React.ReactNode;
};

type ButtonProperties = BaseProperties & {
	ariaLabel?: string;
	onClick: () => void;
};

type LinkProperties = BaseProperties & {
	to: string;
};

type Properties = ButtonProperties | LinkProperties;

const MenuButton: React.FC<ButtonProperties> = ({ ariaLabel, children, onClick }) => (
	<button aria-label={ariaLabel} className={styles["menu-item"]} onClick={onClick} type="button">
		{children}
	</button>
);

const MenuLink: React.FC<LinkProperties> = ({ children, to }) => {
	// `--highlighted` marks the whole branch (route + nested children); `--active`
	// only the exact route. Root ("/") matches exact-only so it does not light up
	// on every page.
	const branchMatch = useMatch({ end: to === ROOT_PATH, path: to });
	const exactMatch = useMatch({ end: true, path: to });

	const className = getValidClassNames(
		styles["menu-item"],
		Boolean(branchMatch) && styles["menu-item--highlighted"],
		Boolean(exactMatch) && styles["menu-item--active"]
	);

	return (
		<Link aria-current={exactMatch ? "page" : undefined} className={className} to={to}>
			{children}
		</Link>
	);
};

const isLinkProperties = (properties: Properties): properties is LinkProperties =>
	"to" in properties;

/**
 * Shared menu entry styled as a plain brand-coloured text link. Given `to` it
 * renders a Link that highlights its branch and marks the exact route active;
 * given `onClick` it renders a button. Used by the player navigation and the
 * admin header/sidebar so every menu looks and behaves the same.
 */
const MenuItem: React.FC<Properties> = (properties) =>
	isLinkProperties(properties) ? <MenuLink {...properties} /> : <MenuButton {...properties} />;

export { MenuItem };
