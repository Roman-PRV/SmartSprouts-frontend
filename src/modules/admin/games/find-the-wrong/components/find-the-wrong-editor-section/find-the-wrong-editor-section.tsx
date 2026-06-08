import { type AdminLevelEditorSectionProperties } from "~/modules/admin/libs/types/admin-level-editor-section-properties.type";

import styles from "../section.module.css";

const FindTheWrongEditorSection: React.FC<AdminLevelEditorSectionProperties> = ({
	game,
	levelId,
}) => {
	return (
		<section className={styles["section"]}>
			<h2 className={styles["section__title"]}>
				{game.title} — Editor: level {levelId}
			</h2>
		</section>
	);
};

export { FindTheWrongEditorSection };
