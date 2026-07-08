import { Loader } from "~/libs/components/components";
import { useGameFetch, useParams, useTranslation } from "~/libs/hooks/hooks";
import { AdminPageFallback } from "~/modules/admin/admin";
import { findAdminGameRegistration } from "~/modules/admin/libs/helpers/find-admin-game-registration.helper";
import { parseLevelId } from "~/modules/admin/libs/helpers/parse-level-id.helper";

import styles from "./styles.module.css";

const AdminLevelEditorPage: React.FC = () => {
	const { t } = useTranslation();
	const { gameId, levelId } = useParams();
	const parsedLevelId = parseLevelId(levelId);
	const { currentGame, isLoading } = useGameFetch(gameId);

	if (!gameId) {
		return <AdminPageFallback message={t("admin.errors.invalidGameId")} />;
	}

	if (parsedLevelId === null) {
		return <AdminPageFallback message={t("admin.errors.invalidLevelId")} />;
	}

	if (isLoading) {
		return <Loader variant="overlay" />;
	}

	if (!currentGame) {
		return <AdminPageFallback message={t("admin.errors.gameNotFound")} />;
	}

	const Section = findAdminGameRegistration(currentGame.key)?.EditorSection ?? null;

	if (!Section) {
		return (
			<AdminPageFallback message={t("admin.errors.unsupportedGame", { key: currentGame.key })} />
		);
	}

	return (
		<div className={styles["page"]}>
			<Section game={currentGame} levelId={parsedLevelId} />
		</div>
	);
};

export { AdminLevelEditorPage };
