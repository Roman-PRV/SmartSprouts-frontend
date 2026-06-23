// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import { type ArithmeticAttemptResponseDto } from "~/games/arithmetic/arithmetic";
import { ArithmeticResultPanel } from "~/libs/components/arithmetic-level-card/arithmetic-result-panel/arithmetic-result-panel";
import { i18n } from "~/libs/modules/localization/localization";

const OPERATOR = "×";

const MOCK_RESULT: ArithmeticAttemptResponseDto = {
	results: [
		{
			correct: true,
			equation_id: 1,
			expected_answer: 3,
			given_answer: 3,
			operand_a: 3,
			operand_b: 1,
			operator: OPERATOR,
		},
		{
			correct: false,
			equation_id: 2,
			expected_answer: 6,
			given_answer: 5,
			operand_a: 3,
			operand_b: 2,
			operator: OPERATOR,
		},
	],
};

describe("ArithmeticResultPanel", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders the score from the correct results", () => {
		render(<ArithmeticResultPanel onPlayAgain={vi.fn()} operator={OPERATOR} result={MOCK_RESULT} />);

		expect(
			screen.getByText(i18n.t("games.arithmetic.result.score", { score: 1, total: 2 }))
		).toBeInTheDocument();
	});

	it("renders each equation with the operator and the given answer", () => {
		render(<ArithmeticResultPanel onPlayAgain={vi.fn()} operator={OPERATOR} result={MOCK_RESULT} />);

		expect(screen.getByText("3 × 1 = 3")).toBeInTheDocument();
		expect(screen.getByText("3 × 2 = 5")).toBeInTheDocument();
	});

	it("shows the expected answer only for an incorrect entry", () => {
		render(<ArithmeticResultPanel onPlayAgain={vi.fn()} operator={OPERATOR} result={MOCK_RESULT} />);

		expect(
			screen.getByText(i18n.t("games.arithmetic.result.expected", { value: 6 }))
		).toBeInTheDocument();
		expect(
			screen.queryByText(i18n.t("games.arithmetic.result.expected", { value: 3 }))
		).not.toBeInTheDocument();
	});

	it("calls onPlayAgain when the play again button is clicked", async () => {
		const onPlayAgain = vi.fn();
		const user = userEvent.setup();

		render(
			<ArithmeticResultPanel onPlayAgain={onPlayAgain} operator={OPERATOR} result={MOCK_RESULT} />
		);

		await user.click(
			screen.getByRole("button", { name: i18n.t("games.arithmetic.actions.playAgain") })
		);

		expect(onPlayAgain).toHaveBeenCalledOnce();
	});
});
