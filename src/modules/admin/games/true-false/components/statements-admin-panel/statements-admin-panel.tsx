import { Button } from "~/libs/components/components";
import { useCallback, useState, useTranslation } from "~/libs/hooks/hooks";
import { useLanguageSwitcher } from "~/libs/modules/localization/localization";

import { type useTrueFalseAudio } from "../../hooks/hooks";
import { type TrueFalseAdminStatementDto } from "../../libs/types/types";
import { CreateStatementModal } from "./create-statement-modal";
import { DeleteStatementModal } from "./delete-statement-modal";
import { StatementRow } from "./statement-row";
import styles from "./styles.module.css";

const EMPTY_LENGTH = 0;

type Properties = {
	audio: ReturnType<typeof useTrueFalseAudio>;
	gameId: string;
	levelId: number;
	statements: TrueFalseAdminStatementDto[];
};

/**
 * Shared statements editor for both true/false games: lists the level's
 * statements, opens the create modal, and hosts inline edit + delete.
 */
const StatementsAdminPanel: React.FC<Properties> = ({ audio, gameId, levelId, statements }) => {
	const { t } = useTranslation();
	const { currentLanguage } = useLanguageSwitcher();
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [pendingDelete, setPendingDelete] = useState<null | TrueFalseAdminStatementDto>(null);

	const handleOpenCreate = useCallback(() => {
		setIsCreateOpen(true);
	}, []);
	const handleCloseCreate = useCallback(() => {
		setIsCreateOpen(false);
	}, []);
	const handleCloseDelete = useCallback(() => {
		setPendingDelete(null);
	}, []);

	return (
		<section className={styles["statements-panel"]}>
			<div className={styles["statements-panel__header"]}>
				<h3 className={styles["statements-panel__title"]}>
					{t("admin.trueFalse.statement.title")}
				</h3>
				<Button onClick={handleOpenCreate} type="button" variant="primary">
					{t("admin.trueFalse.statement.create.cta")}
				</Button>
			</div>

			{statements.length === EMPTY_LENGTH ? (
				<p className={styles["statements-panel__empty"]}>{t("admin.trueFalse.statement.empty")}</p>
			) : (
				<ul className={styles["statements-panel__list"]}>
					{statements.map((statement) => (
						<StatementRow
							audio={audio}
							gameId={gameId}
							key={statement.id}
							onDelete={setPendingDelete}
							statement={statement}
						/>
					))}
				</ul>
			)}

			<CreateStatementModal
				gameId={gameId}
				isOpen={isCreateOpen}
				levelId={levelId}
				onClose={handleCloseCreate}
			/>

			{pendingDelete && (
				<DeleteStatementModal
					gameId={gameId}
					onClose={handleCloseDelete}
					statementId={pendingDelete.id}
					statementText={pendingDelete.statement[currentLanguage]}
				/>
			)}
		</section>
	);
};

export { StatementsAdminPanel };
