import { useTranslation } from "~/libs/hooks/hooks";
import { type UserProfileDto } from "~/modules/profile/profile";

import styles from "./styles.module.css";

type Properties = { stats: UserProfileDto["stats"] };

const FRACTION_DIGITS = 2;

const UserAnalytics: React.FC<Properties> = ({ stats }) => {
	const { t } = useTranslation();

	const items = [
		{ label: t("profile.totalScore"), value: stats.totalScore },
		{ label: t("profile.totalLevels"), value: stats.totalLevels },
		{ label: t("profile.completedLevels"), value: stats.completedLevels },
		{
			label: t("profile.accuracy"),
			value: Number.isNaN(stats.correctAnswersPercentage)
				? "—"
				: `${stats.correctAnswersPercentage.toFixed(FRACTION_DIGITS)}%`,
		},
	];

	return (
		<dl className={styles["analytics"]}>
			{items.map(({ label, value }) => (
				<div className={styles["analytics__item"]} key={label}>
					<dd className={styles["analytics__value"]}>{value}</dd>
					<dt className={styles["analytics__label"]}>{label}</dt>
				</div>
			))}
		</dl>
	);
};

export { UserAnalytics };
