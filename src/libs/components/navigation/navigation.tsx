import { Icon, NavLink } from "~/libs/components/components";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useCallback, useState, useTranslation } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";

const Navigation: React.FC = () => {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);

	const handleBurgerClick = useCallback((): void => {
		setIsOpen((previous) => !previous);
	}, []);

	const handleKeyDownToggle = useCallback(
		(event: React.KeyboardEvent): void => {
			if (event.key === "Enter" || event.key === " ") {
				handleBurgerClick();
			}
		},
		[handleBurgerClick]
	);

	return (
		<nav>
			<div className="px-2 py-4 sm:px-4 lg:px-6">
				<div className="flex items-center justify-between">
					<button
						aria-label={t("common.navigation.toggleMenu")}
						className={getValidClassNames(styles["navigation__burger-button"], "sm:hidden")}
						onClick={handleBurgerClick}
						onKeyDown={handleKeyDownToggle}
					>
						{isOpen ? <Icon name="close" /> : <Icon name="burgerMenu" />}
					</button>
					<ul className={getValidClassNames(styles["navigation__nav"], "hidden sm:flex")}>
						<li>
							<NavLink className={getValidClassNames(styles["navigation__nav-item"])} to="/">
								{t("common.navigation.home")}
							</NavLink>
						</li>
						<li>
							<NavLink className={getValidClassNames(styles["navigation__nav-item"])} to="/games">
								{t("common.navigation.games")}
							</NavLink>
						</li>
						<li>
							<NavLink className={getValidClassNames(styles["navigation__nav-item"])} to="/profile">
								{t("common.navigation.profile")}
							</NavLink>
						</li>
					</ul>
				</div>

				{isOpen && (
					<ul
						className={getValidClassNames(
							styles["navigation__menu"],
							"sm:hidden",
							"text-sm",
							"flex",
							"flex-col",
							"items-end",
							"gap-y-4"
						)}
					>
						<li>
							<NavLink
								className={getValidClassNames(styles["navigation__menu-item"])}
								onClick={handleBurgerClick}
								to="/"
							>
								{t("common.navigation.home")}
							</NavLink>
						</li>
						<li>
							<NavLink
								className={getValidClassNames(styles["navigation__menu-item"])}
								onClick={handleBurgerClick}
								to="/games"
							>
								{t("common.navigation.games")}
							</NavLink>
						</li>
						<li>
							<NavLink
								className={getValidClassNames(styles["navigation__menu-item"])}
								onClick={handleBurgerClick}
								to="/profile"
							>
								{t("common.navigation.profile")}
							</NavLink>
						</li>
					</ul>
				)}
			</div>
		</nav>
	);
};

export { Navigation };
