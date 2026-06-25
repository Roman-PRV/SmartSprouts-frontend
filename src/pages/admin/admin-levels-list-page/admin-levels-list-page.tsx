import { Loader } from "~/libs/components/components";
import { useGameFetch, useParams, useTranslation } from "~/libs/hooks/hooks";
import { AdminPageFallback } from "~/modules/admin/admin";
import { findAdminGameRegistration } from "~/modules/admin/libs/helpers/find-admin-game-registration.helper";

import styles from "./styles.module.css";

const AdminLevelsListPage: React.FC = () => {
	const { t } = useTranslation();
	const { gameId } = useParams();
	const { currentGame, isLoading } = useGameFetch(gameId);

	if (!gameId) {
		return <AdminPageFallback message={t("admin.errors.invalidGameId")} />;
	}

	if (isLoading) {
		return <Loader variant="overlay" />;
	}

	if (!currentGame) {
		return <AdminPageFallback message={t("admin.errors.gameNotFound")} />;
	}

	const Section = findAdminGameRegistration(currentGame.key)?.LevelsListSection ?? null;

	if (!Section) {
		return (
			<AdminPageFallback message={t("admin.errors.unsupportedGame", { key: currentGame.key })} />
		);
	}

	return (
		<div className={styles["page"]}>
			<Section game={currentGame} />
		</div>
	);
};

export { AdminLevelsListPage };
