/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DataStatus } from "~/libs/enums/enums";
import { type GameDescriptionDto } from "~/libs/types/types";

const {
	mockBoard,
	mockClearCurrentLevel,
	mockDispatch,
	mockGetLevelById,
	mockSubmitAttempt,
	mockUnwrap,
	mockUseLanguageSync,
} = vi.hoisted(() => {
	const mockUnwrap = vi.fn();

	return {
		mockBoard: {
			allMatched: false,
			buildAnswers: vi.fn(() => [{ answer: 3, equation_id: 1 }]),
			reset: vi.fn(),
		},
		mockClearCurrentLevel: vi.fn().mockReturnValue({ type: "arithmetic-game/clear" }),
		mockDispatch: vi.fn(() => ({ unwrap: mockUnwrap })),
		mockGetLevelById: vi.fn().mockReturnValue({ type: "arithmetic-game/get" }),
		mockSubmitAttempt: vi.fn().mockReturnValue({ type: "arithmetic-game/submit" }),
		mockUnwrap,
		mockUseLanguageSync: vi.fn<(callback: () => void) => void>(),
	};
});

vi.mock("~/games/arithmetic/arithmetic", () => ({
	actions: {
		clearCurrentLevel: mockClearCurrentLevel,
		getLevelById: mockGetLevelById,
		submitAttempt: mockSubmitAttempt,
	},
	ErrorKind: { GENERIC: "generic", NOT_FOUND: "not_found" },
}));

vi.mock("~/libs/hooks/use-app-dispatch/use-app-dispatch.hook", () => ({
	useAppDispatch: (): typeof mockDispatch => mockDispatch,
}));

vi.mock("~/libs/hooks/use-app-selector/use-app-selector.hook", () => ({
	useAppSelector: vi.fn(),
}));

vi.mock("~/libs/hooks/use-card-board/use-card-board.hook", () => ({
	useCardBoard: () => mockBoard,
}));

vi.mock("~/libs/hooks/use-language-sync/use-language-sync.hook", () => ({
	useLanguageSync: mockUseLanguageSync,
}));

import { useAppSelector } from "~/libs/hooks/use-app-selector/use-app-selector.hook";
import { useArithmeticGame } from "~/libs/hooks/use-arithmetic-game/use-arithmetic-game.hook";

const mockUseAppSelector = vi.mocked(useAppSelector);

const MOCK_GAME: GameDescriptionDto = {
	description: "Multiply",
	icon_url: "/icon.svg",
	id: "game-1",
	key: "multiplication_table" as GameDescriptionDto["key"],
	title: "Multiplication",
};

const MOCK_LEVEL_ID = 3;

const MOCK_RESPONSE = {
	results: [
		{
			correct: true,
			equation_id: 1,
			expected_answer: 3,
			given_answer: 3,
			operand_a: 3,
			operand_b: 1,
			operator: "×",
		},
	],
};

const MOCK_LEVEL = {
	equations: [{ id: 1, operand_a: 3, operand_b: 1, result: 3 }],
	id: 3,
	image_url: null,
	operator: "×",
	title: "Multiply by 3",
	title_audio_url: null,
};

const setSliceState = (overrides: Record<string, unknown> = {}): void => {
	const state = { currentLevel: null, currentStatus: DataStatus.IDLE, error: null, ...overrides };

	mockUseAppSelector.mockImplementation((selector) =>
		selector({ arithmeticLevels: state } as unknown as Parameters<typeof selector>[0])
	);
};

const renderGameHook = () =>
	renderHook(() => useArithmeticGame({ game: MOCK_GAME, levelId: MOCK_LEVEL_ID }));

describe("useArithmeticGame", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockBoard.allMatched = false;
		mockUnwrap.mockResolvedValue(MOCK_RESPONSE);
		setSliceState({ currentLevel: MOCK_LEVEL, currentStatus: DataStatus.FULFILLED });
	});

	it("fetches the level on mount and clears it on unmount", () => {
		const { unmount } = renderGameHook();

		expect(mockGetLevelById).toHaveBeenCalledWith({ gameId: "game-1", levelId: "3" });

		unmount();

		expect(mockClearCurrentLevel).toHaveBeenCalledOnce();
	});

	it("does not submit while the board is not fully matched", async () => {
		mockBoard.allMatched = false;
		const { result } = renderGameHook();

		await act(async () => {
			await result.current.handleSubmit();
		});

		expect(mockSubmitAttempt).not.toHaveBeenCalled();
	});

	it("submits the built answers and stores the result once matched", async () => {
		mockBoard.allMatched = true;
		const { result } = renderGameHook();

		await act(async () => {
			await result.current.handleSubmit();
		});

		expect(mockSubmitAttempt).toHaveBeenCalledWith({
			gameId: "game-1",
			levelId: "3",
			payload: { answers: [{ answer: 3, equation_id: 1 }] },
		});
		expect(result.current.submitResult).toEqual(MOCK_RESPONSE);
	});

	it("resets the board and clears the result on reset", async () => {
		mockBoard.allMatched = true;
		const { result } = renderGameHook();

		await act(async () => {
			await result.current.handleSubmit();
		});

		act(() => {
			result.current.handleReset();
		});

		expect(mockBoard.reset).toHaveBeenCalledOnce();
		expect(result.current.submitResult).toBeNull();
	});

	it("maps a 404 error to the NOT_FOUND error kind", () => {
		setSliceState({
			currentStatus: DataStatus.REJECTED,
			error: { message: "Not found", status: 404 },
		});

		const { result } = renderGameHook();

		expect(result.current.errorKind).toBe("not_found");
	});
});
