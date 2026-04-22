import { type UserProfileDto } from "~/modules/profile/profile";

import { FRACTION_DIGITS } from "../constants/constants.js";

type GetAnalyticsItems = (arguments_: {
	stats: UserProfileDto["stats"];
	t: (key: string) => string;
}) => {
	label: string;
	value: number | string;
}[];

const getAnalyticsItems: GetAnalyticsItems = ({ stats, t }) => {
	return [
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
};

export { getAnalyticsItems };
