import { type TFunction } from "i18next";
import { describe, expect, it } from "vitest";

import { ACCURACY_FALLBACK } from "~/pages/profile-page/libs/constants/constants";
import { getAnalyticsItems } from "~/pages/profile-page/libs/helpers/helpers";
import { type UserProfileDto } from "~/modules/profile/profile";

// ─── Helpers ────────────────────────────────────────────────────────────────────────────────

const t = ((key: string) => key) as TFunction;

type Stats = UserProfileDto["stats"];

const makeStats = (overrides: Partial<Stats> = {}): Stats => ({
	completedLevels: 5,
	correctAnswersPercentage: 75.5,
	totalLevels: 10,
	totalScore: 200,
	...overrides,
});

// ─── Tests ───────────────────────────────────────────────────────────────────────────────────

describe("getAnalyticsItems", () => {
	it("should include all expected analytics labels", () => {
		const result = getAnalyticsItems({ stats: makeStats(), t });
		const labels = result.map((item) => item.label);

		expect(labels).toEqual(
			expect.arrayContaining([
				"profile.totalScore",
				"profile.totalLevels",
				"profile.completedLevels",
				"profile.accuracy",
			]),
		);
	});

	it("should return totalScore item", () => {
		const result = getAnalyticsItems({ stats: makeStats({ totalScore: 999 }), t });
		const item = result.find((i) => i.label === "profile.totalScore");

		expect(item).toEqual({ label: "profile.totalScore", value: 999 });
	});

	it("should return totalLevels item", () => {
		const result = getAnalyticsItems({ stats: makeStats({ totalLevels: 42 }), t });
		const item = result.find((i) => i.label === "profile.totalLevels");

		expect(item).toEqual({ label: "profile.totalLevels", value: 42 });
	});

	it("should return completedLevels item", () => {
		const result = getAnalyticsItems({ stats: makeStats({ completedLevels: 7 }), t });
		const item = result.find((i) => i.label === "profile.completedLevels");

		expect(item).toEqual({ label: "profile.completedLevels", value: 7 });
	});

	describe("accuracy", () => {
		it("should format correctAnswersPercentage to 2 decimal places with % sign", () => {
			const result = getAnalyticsItems({ stats: makeStats({ correctAnswersPercentage: 75.555 }), t });
			const item = result.find((i) => i.label === "profile.accuracy");

			expect(item).toEqual({ label: "profile.accuracy", value: "75.56%" });
		});

		it("should return fallback when correctAnswersPercentage is NaN", () => {
			const result = getAnalyticsItems({ stats: makeStats({ correctAnswersPercentage: NaN }), t });
			const item = result.find((i) => i.label === "profile.accuracy");

			expect(item).toEqual({ label: "profile.accuracy", value: ACCURACY_FALLBACK });
		});

		it("should format 0% correctly", () => {
			const result = getAnalyticsItems({ stats: makeStats({ correctAnswersPercentage: 0 }), t });
			const item = result.find((i) => i.label === "profile.accuracy");

			expect(item).toEqual({ label: "profile.accuracy", value: "0.00%" });
		});

		it("should format 100% correctly", () => {
			const result = getAnalyticsItems({ stats: makeStats({ correctAnswersPercentage: 100 }), t });
			const item = result.find((i) => i.label === "profile.accuracy");

			expect(item).toEqual({ label: "profile.accuracy", value: "100.00%" });
		});

		it("should render Infinity% when correctAnswersPercentage is Infinity", () => {
			const result = getAnalyticsItems({ stats: makeStats({ correctAnswersPercentage: Infinity }), t });
			const item = result.find((i) => i.label === "profile.accuracy");

			expect(item).toEqual({ label: "profile.accuracy", value: "Infinity%" });
		});
	});
});
