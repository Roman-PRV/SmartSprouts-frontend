import { Button, Link } from "~/libs/components/components";
import { useCallback, useTranslation } from "~/libs/hooks/hooks";
import { buildAdminEditorUrl } from "~/modules/admin/libs/helpers/build-admin-editor-url.helper";

import { type TrueFalseAdminLevelDto } from "../../libs/types/types";
import styles from "./styles.module.css";

const EMPTY_COUNT = 0;

type Properties = {
	gameId: string;
	level: TrueFalseAdminLevelDto;
	localizedTitle: string;
	onDelete: (level: TrueFalseAdminLevelDto) => void;
};

const LevelRow: React.FC<Properties> = ({ gameId, level, localizedTitle, onDelete }) => {
	const { t } = useTranslation();

	const handleDelete = useCallback(() => {
		onDelete(level);
	}, [level, onDelete]);

	return (
		<tr>
			<td>{level.id}</td>
			<td>{localizedTitle}</td>
			<td>{level.statements_count ?? EMPTY_COUNT}</td>
			<td className={styles["levels-list__actions"]}>
				<Link to={buildAdminEditorUrl(gameId, level.id)}>{t("admin.trueFalse.list.edit")}</Link>
				<Button onClick={handleDelete} type="button" variant="secondary">
					{t("admin.trueFalse.list.delete")}
				</Button>
			</td>
		</tr>
	);
};

export { LevelRow };
