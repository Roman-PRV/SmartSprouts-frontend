// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import { type SubmitAttemptResponseDto } from "~/games/find-the-wrong/find-the-wrong";
import { FindTheWrongResultPanel } from "~/libs/components/find-the-wrong-level-card/find-the-wrong-result-panel/find-the-wrong-result-panel";
import { i18n } from "~/libs/modules/localization/localization";

const MOCK_RESULT: SubmitAttemptResponseDto = {
	found_items: [
		{
			explanation: "Apples are fruit.",
			explanation_audio_url: null,
			id: 1,
			name: "Apple",
			name_audio_url: null,
			stars: 3,
		},
	],
	missed_items: [
		{
			explanation: "A car is not a fruit.",
			explanation_audio_url: null,
			id: 2,
			name: "Car",
			name_audio_url: null,
		},
	],
	score: 1,
	total_questions: 2,
};

describe("FindTheWrongResultPanel", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders the score summary", () => {
		render(<FindTheWrongResultPanel onPlayAgain={vi.fn()} result={MOCK_RESULT} />);

		expect(
			screen.getByText(
				i18n.t("games.findTheWrong.result.scoreSummary", { score: 1, total: 2 })
			)
		).toBeInTheDocument();
	});

	it("renders found and missed item names", () => {
		render(<FindTheWrongResultPanel onPlayAgain={vi.fn()} result={MOCK_RESULT} />);

		expect(screen.getByText("Apple")).toBeInTheDocument();
		expect(screen.getByText("Car")).toBeInTheDocument();
		expect(screen.getByText("Apples are fruit.")).toBeInTheDocument();
		expect(screen.getByText("A car is not a fruit.")).toBeInTheDocument();
	});

	it("renders found and missed section headings", () => {
		render(<FindTheWrongResultPanel onPlayAgain={vi.fn()} result={MOCK_RESULT} />);

		expect(
			screen.getByRole("heading", { name: i18n.t("games.findTheWrong.result.foundSection") })
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: i18n.t("games.findTheWrong.result.missedSection") })
		).toBeInTheDocument();
	});

	it("calls onPlayAgain when the play again button is clicked", async () => {
		const onPlayAgain = vi.fn();
		const user = userEvent.setup();

		render(<FindTheWrongResultPanel onPlayAgain={onPlayAgain} result={MOCK_RESULT} />);

		await user.click(
			screen.getByRole("button", { name: i18n.t("games.findTheWrong.actions.playAgain") })
		);

		expect(onPlayAgain).toHaveBeenCalledOnce();
	});

	it("omits a section when its item list is empty", () => {
		const resultWithoutMissed: SubmitAttemptResponseDto = {
			...MOCK_RESULT,
			missed_items: [],
		};

		render(<FindTheWrongResultPanel onPlayAgain={vi.fn()} result={resultWithoutMissed} />);

		expect(
			screen.queryByRole("heading", { name: i18n.t("games.findTheWrong.result.missedSection") })
		).not.toBeInTheDocument();
	});
});
