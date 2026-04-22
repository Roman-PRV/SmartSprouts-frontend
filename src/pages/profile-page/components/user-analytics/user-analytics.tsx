import type { User } from "~/modules/auth/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	user: User;
};

const UserAnalytics: React.FC<Properties> = ({ user }) => {
	const analytics = user.analytics ?? {
		completedLevels: 0,
		correctAnswersPercentage: 0,
		totalLevels: 0,
	};

	return (
		<div className={styles["analytics"]}>
			<div className={styles["analytics__item"]}>
				<span className={styles["analytics__value"]}>{analytics.totalLevels}</span>
				<span className={styles["analytics__label"]}>Total Levels</span>
			</div>
			<div className={styles["analytics__item"]}>
				<span className={styles["analytics__value"]}>{analytics.completedLevels}</span>
				<span className={styles["analytics__label"]}>Completed Levels</span>
			</div>
			<div className={styles["analytics__item"]}>
				<span className={styles["analytics__value"]}>{analytics.correctAnswersPercentage}%</span>
				<span className={styles["analytics__label"]}>Accuracy</span>
			</div>
		</div>
	);
};

export { UserAnalytics };
