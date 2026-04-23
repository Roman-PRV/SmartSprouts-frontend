import { type TFunction } from "i18next";

import { type UserProfileDto } from "~/modules/profile/profile";

import { ACCURACY_FALLBACK, FRACTION_DIGITS } from "../constants/constants";

type GetAnalyticsItems = (arguments_: { stats: UserProfileDto["stats"]; t: TFunction }) => {
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
				? ACCURACY_FALLBACK
				: `${stats.correctAnswersPercentage.toFixed(FRACTION_DIGITS)}%`,
		},
	];
};

export { getAnalyticsItems };
