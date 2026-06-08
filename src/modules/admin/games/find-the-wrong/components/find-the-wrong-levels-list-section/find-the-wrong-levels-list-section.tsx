import { type AdminLevelsListSectionProperties } from "~/modules/admin/libs/types/admin-levels-list-section-properties.type";

import styles from "../section.module.css";

const FindTheWrongLevelsListSection: React.FC<AdminLevelsListSectionProperties> = ({ game }) => {
	return (
		<section className={styles["section"]}>
			<h2 className={styles["section__title"]}>Levels for {game.title}</h2>
		</section>
	);
};

export { FindTheWrongLevelsListSection };
