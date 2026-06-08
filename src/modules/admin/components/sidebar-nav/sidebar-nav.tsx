import { NavLink } from "react-router-dom";

import { DataStatus } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useLanguageSync,
	useTranslation,
} from "~/libs/hooks/hooks";
import { actions as gamesActions } from "~/modules/games/games";

import { ADMIN_GAMES_REGISTRY } from "../../libs/constants/admin-games-registry.constants";
import { buildAdminLevelsListUrl } from "../../libs/helpers/build-admin-levels-list-url.helper";
import styles from "./styles.module.css";

type ItemClassNameOptions = {
	isActive: boolean;
	isDisabled: boolean;
};

const getItemClassName = ({ isActive, isDisabled }: ItemClassNameOptions): string =>
	getValidClassNames(
		styles["sidebar-nav__item"],
		isActive && styles["sidebar-nav__item--active"],
		isDisabled && styles["sidebar-nav__item--disabled"]
	);

const getNavLinkClassName = ({ isActive }: { isActive: boolean }): string =>
	getItemClassName({ isActive, isDisabled: false });

const SidebarNav: React.FC = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const games = useAppSelector((state) => state.games.games);
	const gamesStatus = useAppSelector((state) => state.games.gamesStatus);

	const fetchGames = useCallback((): void => {
		void dispatch(gamesActions.getAllGames());
	}, [dispatch]);

	useEffect(() => {
		if (gamesStatus === DataStatus.IDLE) {
			fetchGames();
		}
	}, [fetchGames, gamesStatus]);

	useLanguageSync(fetchGames);

	const isLoading = gamesStatus === DataStatus.IDLE || gamesStatus === DataStatus.PENDING;

	if (isLoading) {
		return (
			<nav className={styles["sidebar-nav"]}>
				{ADMIN_GAMES_REGISTRY.map(({ gameKey }) => (
					<span
						aria-busy="true"
						className={getValidClassNames(
							styles["sidebar-nav__item"],
							styles["sidebar-nav__item--skeleton"]
						)}
						key={gameKey}
					/>
				))}
			</nav>
		);
	}

	return (
		<nav className={styles["sidebar-nav"]}>
			{ADMIN_GAMES_REGISTRY.map(({ gameKey, labelKey }) => {
				const game = games.find((entry) => entry.key === gameKey);

				if (!game) {
					return (
						<span
							aria-disabled="true"
							className={getItemClassName({ isActive: false, isDisabled: true })}
							key={gameKey}
							title={t("admin.nav.gameUnavailable")}
						>
							{t(labelKey)}
						</span>
					);
				}

				return (
					<NavLink
						className={getNavLinkClassName}
						key={gameKey}
						to={buildAdminLevelsListUrl(game.id)}
					>
						{game.title}
					</NavLink>
				);
			})}
		</nav>
	);
};

export { SidebarNav };
