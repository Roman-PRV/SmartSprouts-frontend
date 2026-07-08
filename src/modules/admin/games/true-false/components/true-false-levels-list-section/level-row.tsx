import { Button, FallbackImage, Link } from "~/libs/components/components";
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
			<td>
				{level.image_url ? (
					<FallbackImage
						alt={localizedTitle}
						className={styles["levels-list__thumbnail"]}
						loading="lazy"
						src={level.image_url}
					/>
				) : (
					<span className={styles["levels-list__thumbnail-placeholder"]} />
				)}
			</td>
			<td>{level.statements_count ?? EMPTY_COUNT}</td>
			<td>
				<div className={styles["levels-list__row-actions"]}>
					<Link
						className={styles["levels-list__edit-link"]}
						to={buildAdminEditorUrl(gameId, level.id)}
					>
						{t("admin.trueFalse.list.edit")}
					</Link>
					<Button onClick={handleDelete} type="button" variant="danger">
						{t("admin.trueFalse.list.delete")}
					</Button>
				</div>
			</td>
		</tr>
	);
};

export { LevelRow };
