import { Outlet } from "react-router-dom";

import {
	LanguageSwitcher,
	LanguageSwitcherVariant,
	Logo,
	MenuItem,
} from "~/libs/components/components";
import { AppRoute } from "~/libs/enums/enums";
import { useAppSelector, useCallback, useTranslation } from "~/libs/hooks/hooks";
import { useLogout } from "~/modules/auth/auth";

import { SidebarNav } from "../sidebar-nav/sidebar-nav";
import styles from "./styles.module.css";

const AdminLayout: React.FC = () => {
	const { t } = useTranslation();
	const { logout } = useLogout();
	const user = useAppSelector(({ auth }) => auth.user);

	const handleLogout = useCallback((): void => {
		void logout();
	}, [logout]);

	return (
		<div className={styles["admin-layout"]}>
			<header className={styles["admin-layout__header"]}>
				<div className={styles["admin-layout__brand"]}>
					<Logo />
					<h1 className={styles["admin-layout__title"]}>{t("admin.header.title")}</h1>
				</div>
				<div className={styles["admin-layout__actions"]}>
					{user && (
						<span className={styles["admin-layout__user"]}>
							{t("admin.header.loggedInAs", { name: user.name })}
						</span>
					)}
					<ul className={styles["admin-layout__menu"]}>
						<li>
							<MenuItem to={AppRoute.ROOT}>{t("admin.header.exitToApp")}</MenuItem>
						</li>
						<li>
							<MenuItem ariaLabel={t("common.navigation.logout")} onClick={handleLogout}>
								{t("common.navigation.logout")}
							</MenuItem>
						</li>
					</ul>
					<LanguageSwitcher variant={LanguageSwitcherVariant.BASE} />
				</div>
			</header>
			<div className={styles["admin-layout__body"]}>
				<SidebarNav />
				<main className={styles["admin-layout__main"]}>
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export { AdminLayout };
