import { Button } from "~/libs/components/components";
import { useCallback, useState, useTranslation } from "~/libs/hooks/hooks";
import { useLanguageSwitcher } from "~/libs/modules/localization/localization";

import { type useTrueFalseAudio } from "../../hooks/hooks";
import { type TrueFalseAdminStatementDto } from "../../libs/types/types";
import { EditStatementForm } from "./edit-statement-form";
import styles from "./styles.module.css";

type Properties = {
	audio: ReturnType<typeof useTrueFalseAudio>;
	gameId: string;
	onDelete: (statement: TrueFalseAdminStatementDto) => void;
	statement: TrueFalseAdminStatementDto;
};

const StatementRow: React.FC<Properties> = ({ audio, gameId, onDelete, statement }) => {
	const { t } = useTranslation();
	const { currentLanguage } = useLanguageSwitcher();
	const [isEditing, setIsEditing] = useState(false);

	const handleEdit = useCallback(() => {
		setIsEditing(true);
	}, []);
	const handleDone = useCallback(() => {
		setIsEditing(false);
	}, []);
	const handleDelete = useCallback(() => {
		onDelete(statement);
	}, [onDelete, statement]);

	return (
		<li className={styles["statement-row"]}>
			<div className={styles["statement-row__header"]}>
				<span className={styles["statement-row__text"]}>
					{statement.statement[currentLanguage]}
				</span>
				<span
					className={styles["statement-row__badge"]}
					data-truth={statement.is_true ? "true" : "false"}
				>
					{statement.is_true
						? t("admin.trueFalse.statement.badge.true")
						: t("admin.trueFalse.statement.badge.false")}
				</span>
				<div className={styles["statement-row__actions"]}>
					{!isEditing && (
						<Button onClick={handleEdit} type="button" variant="secondary">
							{t("admin.trueFalse.statement.row.edit")}
						</Button>
					)}
					<Button onClick={handleDelete} type="button" variant="secondary">
						{t("admin.trueFalse.statement.row.delete")}
					</Button>
				</div>
			</div>

			{isEditing && (
				<EditStatementForm
					audio={audio}
					gameId={gameId}
					onDone={handleDone}
					statement={statement}
				/>
			)}
		</li>
	);
};

export { StatementRow };
