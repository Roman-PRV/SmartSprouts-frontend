import { Button, Link } from "~/libs/components/components";
import { useCallback, useState, useTranslation } from "~/libs/hooks/hooks";
import { buildAdminEditorUrl } from "~/modules/admin/libs/helpers/build-admin-editor-url.helper";

import { type FindTheWrongAdminLevelDto } from "../../libs/types/types";
import styles from "./styles.module.css";

type Properties = {
	gameId: string;
	level: FindTheWrongAdminLevelDto;
	localizedTitle: string;
	onDelete: (level: FindTheWrongAdminLevelDto) => void;
};

const LevelRow: React.FC<Properties> = ({ gameId, level, localizedTitle, onDelete }) => {
	const { t } = useTranslation();
	const [hasImageError, setHasImageError] = useState(false);

	const handleDelete = useCallback(() => {
		onDelete(level);
	}, [level, onDelete]);

	const handleImageError = useCallback(() => {
		setHasImageError(true);
	}, []);

	const showImage = Boolean(level.image_url) && !hasImageError;

	return (
		<tr>
			<td>{level.id}</td>
			<td>{localizedTitle}</td>
			<td>
				{showImage ? (
					<img
						alt={localizedTitle}
						className={styles["levels-list__thumbnail"]}
						loading="lazy"
						onError={handleImageError}
						src={level.image_url ?? ""}
					/>
				) : (
					<span className={styles["levels-list__thumbnail-placeholder"]} />
				)}
			</td>
			<td>{level.items_count}</td>
			<td>
				<div className={styles["levels-list__row-actions"]}>
					<Link
						className={styles["levels-list__edit-link"]}
						to={buildAdminEditorUrl(gameId, level.id)}
					>
						{t("admin.findTheWrong.list.actions.edit")}
					</Link>
					<Button onClick={handleDelete} type="button" variant="danger">
						{t("admin.findTheWrong.list.actions.delete")}
					</Button>
				</div>
			</td>
		</tr>
	);
};

export { LevelRow };
