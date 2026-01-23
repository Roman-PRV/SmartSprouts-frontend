import { Button, Icon, NavLink } from "~/libs/components/components";
import { AppRoute } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppSelector, useCallback, useState, useTranslation } from "~/libs/hooks/hooks";
import { useLogout } from "~/modules/auth/auth";

import styles from "./styles.module.css";

const Navigation: React.FC = () => {
	const { t } = useTranslation();
	const { isAuthenticated } = useAppSelector((state) => state.auth);
	const { logout } = useLogout();
	const [isOpen, setIsOpen] = useState(false);

	const handleBurgerClick = useCallback((): void => {
		setIsOpen((previous) => !previous);
	}, []);

	const handleLogout = useCallback((): void => {
		setIsOpen(false);
		void logout();
	}, [logout]);

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
			<div className="flex items-center justify-between">
				<button
					aria-label={t("common.navigation.toggleMenu")}
					className={getValidClassNames(styles["navigation__burger-button"])}
					onClick={handleBurgerClick}
					onKeyDown={handleKeyDownToggle}
				>
					{isOpen ? <Icon name="close" /> : <Icon name="burgerMenu" />}
				</button>
				<ul className={getValidClassNames(styles["navigation__nav"])}>
					<li>
						<NavLink
							className={getValidClassNames(styles["navigation__nav-item"])}
							to={AppRoute.ROOT}
						>
							{t("common.navigation.home")}
						</NavLink>
					</li>
					<li>
						<NavLink
							className={getValidClassNames(styles["navigation__nav-item"])}
							to={AppRoute.GAMES}
						>
							{t("common.navigation.games")}
						</NavLink>
					</li>
					<li>
						<NavLink
							className={getValidClassNames(styles["navigation__nav-item"])}
							to={AppRoute.PROFILE}
						>
							{t("common.navigation.profile")}
						</NavLink>
					</li>
					{isAuthenticated && (
						<li>
							<Button
								aria-label={t("common.navigation.logout")}
								className={getValidClassNames(styles["navigation__nav-item"])}
								onClick={handleLogout}
								variant="unstyled"
							>
								{t("common.navigation.logout")}
							</Button>
						</li>
					)}
				</ul>
			</div>

			{isOpen && (
				<ul className={getValidClassNames(styles["navigation__menu"])}>
					<li>
						<NavLink
							className={getValidClassNames(styles["navigation__menu-item"])}
							onClick={handleBurgerClick}
							to={AppRoute.ROOT}
						>
							{t("common.navigation.home")}
						</NavLink>
					</li>
					<li>
						<NavLink
							className={getValidClassNames(styles["navigation__menu-item"])}
							onClick={handleBurgerClick}
							to={AppRoute.GAMES}
						>
							{t("common.navigation.games")}
						</NavLink>
					</li>
					<li>
						<NavLink
							className={getValidClassNames(styles["navigation__menu-item"])}
							onClick={handleBurgerClick}
							to={AppRoute.PROFILE}
						>
							{t("common.navigation.profile")}
						</NavLink>
					</li>
					{isAuthenticated && (
						<li>
							<Button
								aria-label={t("common.navigation.logout")}
								className={getValidClassNames(styles["navigation__menu-item"])}
								onClick={handleLogout}
								variant="unstyled"
							>
								{t("common.navigation.logout")}
							</Button>
						</li>
					)}
				</ul>
			)}
		</nav>
	);
};

export { Navigation };
