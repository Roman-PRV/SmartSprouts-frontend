import type { DropdownOption, RenderToggleProperties } from "~/libs/components/dropdown/dropdown";

import { Dropdown, Icon, MenuItem } from "~/libs/components/components";
import { AppRoute } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import {
	useAppSelector,
	useCallback,
	useLocation,
	useMemo,
	useNavigate,
	useTranslation,
} from "~/libs/hooks/hooks";
import { useLogout } from "~/modules/auth/auth";

import styles from "./styles.module.css";

const LOGOUT_OPTION = "logout";

type NavItem = {
	isVisible: boolean;
	labelKey: string;
	route: string;
};

const Navigation: React.FC = () => {
	const { t } = useTranslation();
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const isAdmin = useAppSelector((state) => Boolean(state.auth.user?.is_admin));
	const { logout } = useLogout();
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const handleLogout = useCallback((): void => {
		void logout();
	}, [logout]);

	// Single source of the route entries; both the desktop list and the mobile
	// dropdown map over this so they can never drift. Logout is appended separately
	// because it is an action, not a route.
	const navItems = useMemo<NavItem[]>(
		() =>
			[
				{ isVisible: true, labelKey: "common.navigation.home", route: AppRoute.ROOT },
				{ isVisible: true, labelKey: "common.navigation.games", route: AppRoute.GAMES },
				{ isVisible: true, labelKey: "common.navigation.profile", route: AppRoute.PROFILE },
				{
					isVisible: isAdmin,
					labelKey: "common.navigation.adminPanel",
					route: AppRoute.ADMIN_ROOT,
				},
			].filter((item) => item.isVisible),
		[isAdmin]
	);

	const navigationOptions = useMemo<DropdownOption<string>[]>(() => {
		const options: DropdownOption<string>[] = navItems.map((item) => ({
			label: t(item.labelKey),
			value: item.route,
		}));

		if (isAuthenticated) {
			options.push({ label: t("common.navigation.logout"), value: LOGOUT_OPTION });
		}

		return options;
	}, [t, navItems, isAuthenticated]);

	const handleMobileMenuSelect = useCallback(
		(value: string): void => {
			if (value === LOGOUT_OPTION) {
				handleLogout();
			} else {
				void navigate(value);
			}
		},
		[handleLogout, navigate]
	);

	const renderToggle = useCallback((properties: RenderToggleProperties) => {
		const { isOpen, ...buttonProperties } = properties;

		return (
			<button
				{...buttonProperties}
				className={getValidClassNames(styles["navigation__burger-button"])}
			>
				{isOpen ? <Icon name="close" /> : <Icon name="burgerMenu" />}
			</button>
		);
	}, []);

	const currentActiveValue = useMemo(() => {
		const matchingOption = navigationOptions.find((option) => {
			if (option.value === AppRoute.ROOT) {
				return pathname === AppRoute.ROOT;
			}

			return pathname === option.value || pathname.startsWith(`${option.value}/`);
		});

		return matchingOption?.value ?? pathname;
	}, [pathname, navigationOptions]);

	return (
		<nav className={getValidClassNames(styles["navigation"])}>
			<div className={getValidClassNames(styles["navigation__container"])}>
				<Dropdown
					className={getValidClassNames(styles["navigation__mobile-dropdown"])}
					itemClassName={getValidClassNames(styles["navigation__mobile-menu-item"])}
					itemRole="menuitem"
					menuClassName={getValidClassNames(styles["navigation__mobile-menu"])}
					menuId="mobile-menu"
					menuRole="menu"
					onSelect={handleMobileMenuSelect}
					options={navigationOptions}
					renderToggle={renderToggle}
					toggleAriaLabel={t("common.navigation.toggleMenu")}
					toggleId="burger-button"
					toggleRole="button"
					value={currentActiveValue}
				/>
				<ul className={getValidClassNames(styles["navigation__nav"])}>
					{navItems.map((item) => (
						<li key={item.route}>
							<MenuItem to={item.route}>{t(item.labelKey)}</MenuItem>
						</li>
					))}
					{isAuthenticated && (
						<li>
							<MenuItem ariaLabel={t("common.navigation.logout")} onClick={handleLogout}>
								{t("common.navigation.logout")}
							</MenuItem>
						</li>
					)}
				</ul>
			</div>
		</nav>
	);
};

export { Navigation };
