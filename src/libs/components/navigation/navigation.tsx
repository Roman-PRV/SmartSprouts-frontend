import type { DropdownOption, RenderToggleProperties } from "~/libs/components/dropdown/dropdown";

import { Button, Dropdown, Icon, NavLink } from "~/libs/components/components";
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
	const { isAuthenticated } = useAppSelector((state) => state.auth);
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

		if (isAuthenticated) {
			options.push({ label: t("common.navigation.logout"), value: LOGOUT_OPTION });
		}

		return options;
	}, [t, isAuthenticated]);

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

	const renderToggle = useCallback(
		(properties: RenderToggleProperties) => {
			const { isOpen, ...buttonProperties } = properties;

			return (
				<button
					{...buttonProperties}
					aria-label={t("common.navigation.toggleMenu")}
					className={getValidClassNames(styles["navigation__burger-button"])}
				>
					{isOpen ? <Icon name="close" /> : <Icon name="burgerMenu" />}
				</button>
			);
		},
		[t]
	);

	const currentActiveValue = useMemo(() => {
		const matchingOption = navigationOptions.find((option) => {
			if (option.value === AppRoute.ROOT) {
				return pathname === AppRoute.ROOT;
			}

			return pathname.startsWith(option.value);
		});

		return matchingOption?.value ?? pathname;
	}, [pathname, navigationOptions]);

	return (
		<nav className={getValidClassNames(styles["navigation"])}>
			<div className="flex items-center justify-between">
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
					toggleId="burger-button"
					toggleRole="button"
					value={currentActiveValue}
				/>
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
		</nav>
	);
};

export { Navigation };
