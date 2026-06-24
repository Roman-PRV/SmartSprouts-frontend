import { Button, FallbackMessage, MenuItem } from "~/libs/components/components";
import { DataStatus } from "~/libs/enums/enums";
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
	const isRejected = gamesStatus === DataStatus.REJECTED;

	if (isLoading) {
		return (
			<nav className={styles["sidebar-nav"]}>
				{ADMIN_GAMES_REGISTRY.map(({ gameKey }) => (
					<span
						aria-busy="true"
						className={styles["sidebar-nav__skeleton"]}
						key={gameKey}
					/>
				))}
			</nav>
		);
	}

	if (isRejected) {
		return (
			<nav className={styles["sidebar-nav"]}>
				<div className={styles["sidebar-nav__error"]}>
					<FallbackMessage message={t("admin.nav.loadError")} />
					<Button onClick={fetchGames} type="button" variant="secondary">
						{t("admin.nav.retry")}
					</Button>
				</div>
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
							className={styles["sidebar-nav__disabled"]}
							key={gameKey}
							title={t("admin.nav.gameUnavailable")}
						>
							{t(labelKey)}
						</span>
					);
				}

				return (
					<MenuItem key={gameKey} to={buildAdminLevelsListUrl(game.id)}>
						{game.title}
					</MenuItem>
				);
			})}
		</nav>
	);
};

export { SidebarNav };
