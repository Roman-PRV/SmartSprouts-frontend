// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import type * as HooksModule from "~/libs/hooks/hooks";

import { type GameDescriptionDto } from "~/libs/types/types";

const { mockGameState } = vi.hoisted(() => ({
	mockGameState: {
		board: {
			activeKey: null,
			allMatched: false,
			answerCards: [{ key: "ans-0", type: "answer", value: 3 }],
			boardSize: { height: 200, width: 200 },
			buildAnswers: vi.fn(() => []),
			equationCards: [{ equationId: 1, key: "eq-1", operandA: 3, operandB: 1, type: "equation" }],
			onDragEnd: vi.fn(),
			onDragMove: vi.fn(),
			onDragStart: vi.fn(),
			pairs: { "eq-1": null },
			positions: { "ans-0": { x: 50, y: 50 }, "eq-1": { x: 0, y: 0 } },
			reset: vi.fn(),
		},
		errorKind: null,
		handleReset: vi.fn(),
		handleSubmit: vi.fn(),
		hasSubmitError: false,
		isSubmitting: false,
		level: {
			equations: [{ id: 1, operand_a: 3, operand_b: 1, result: 3 }],
			id: 3,
			image_url: null,
			operator: "×",
			title: "Multiply by 3",
			title_audio_url: null,
		},
		status: "fulfilled",
		submitResult: null,
	},
}));

vi.mock("~/libs/hooks/hooks", async (importOriginal) => {
	const actual = await importOriginal<typeof HooksModule>();

	return { ...actual, useArithmeticGame: () => mockGameState };
});

import { ArithmeticLevelCard } from "~/libs/components/arithmetic-level-card/arithmetic-level-card";

const MOCK_GAME: GameDescriptionDto = {
	description: "Multiply",
	icon_url: "/icon.svg",
	id: "game-1",
	key: "multiplication_table" as GameDescriptionDto["key"],
	title: "Multiplication",
};

const renderCard = (): void => {
	render(
		<MemoryRouter>
			<ArithmeticLevelCard game={MOCK_GAME} levelId={3} />
		</MemoryRouter>
	);
};

describe("ArithmeticLevelCard", () => {
	beforeEach(() => {
		mockGameState.level.operator = "×";
	});

	afterEach(() => {
		cleanup();
	});

	it("renders the level title", () => {
		renderCard();

		expect(screen.getByRole("heading", { name: "Multiply by 3" })).toBeInTheDocument();
	});

	it("renders the multiplication operator from the level DTO", () => {
		mockGameState.level.operator = "×";

		renderCard();

		expect(screen.getByText("3 × 1 =")).toBeInTheDocument();
	});

	it("renders the addition operator from the level DTO", () => {
		mockGameState.level.operator = "+";

		renderCard();

		expect(screen.getByText("3 + 1 =")).toBeInTheDocument();
	});
});
