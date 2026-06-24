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

	const navigationOptions = useMemo<DropdownOption<string>[]>(() => {
		const options: DropdownOption<string>[] = [
			{ label: t("common.navigation.home"), value: AppRoute.ROOT },
			{ label: t("common.navigation.games"), value: AppRoute.GAMES },
			{ label: t("common.navigation.profile"), value: AppRoute.PROFILE },
		];

		if (isAdmin) {
			options.push({ label: t("common.navigation.adminPanel"), value: AppRoute.ADMIN_ROOT });
		}

		if (isAuthenticated) {
			options.push({ label: t("common.navigation.logout"), value: LOGOUT_OPTION });
		}

		return options;
	}, [t, isAdmin, isAuthenticated]);

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
					<li>
						<MenuItem to={AppRoute.ROOT}>{t("common.navigation.home")}</MenuItem>
					</li>
					<li>
						<MenuItem to={AppRoute.GAMES}>{t("common.navigation.games")}</MenuItem>
					</li>
					<li>
						<MenuItem to={AppRoute.PROFILE}>{t("common.navigation.profile")}</MenuItem>
					</li>
					{isAdmin && (
						<li>
							<MenuItem to={AppRoute.ADMIN_ROOT}>{t("common.navigation.adminPanel")}</MenuItem>
						</li>
					)}
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
