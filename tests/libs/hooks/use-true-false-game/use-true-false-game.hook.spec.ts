/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ErrorKind } from "~/games/true-false-game/libs/enums/enums";
import {
	type TrueFalseGameLevelDto,
	type TrueFalseGameResultDto,
} from "~/games/true-false-game/libs/types/types";
import { DataStatus } from "~/libs/enums/enums";
import { HTTPCode } from "~/libs/modules/http/http";
import { type GameDescriptionDto, type ThunkErrorPayload } from "~/libs/types/types";

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const {
	mockCheckAnswers,
	mockClearCurrentLevel,
	mockDispatch,
	mockGetLevelById,
	mockUseLanguageSync,
} = vi.hoisted(() => {
	const mockGetLevelById = vi.fn().mockReturnValue({ type: "true-false-game/get-level-by-id" });
	const mockCheckAnswers = vi.fn().mockReturnValue({ type: "true-false-game/check-answers" });
	const mockClearCurrentLevel = vi.fn().mockReturnValue({ type: "true-false-game/clearCurrentLevel" });
	const mockDispatch = vi.fn();
	const mockUseLanguageSync = vi.fn<(callback: () => void) => void>();

	return {
		mockCheckAnswers,
		mockClearCurrentLevel,
		mockDispatch,
		mockGetLevelById,
		mockUseLanguageSync,
	};
});

vi.mock("~/games/true-false-game/api/true-false-game", () => ({
	actions: {
		checkAnswers: mockCheckAnswers,
		clearCurrentLevel: mockClearCurrentLevel,
		getLevelById: mockGetLevelById,
	},
}));

vi.mock("~/libs/hooks/use-app-dispatch/use-app-dispatch.hook", () => ({
	useAppDispatch: (): typeof mockDispatch => mockDispatch,
}));

vi.mock("~/libs/hooks/use-app-selector/use-app-selector.hook", () => ({
	useAppSelector: vi.fn(),
}));

vi.mock("~/libs/hooks/use-language-sync/use-language-sync.hook", () => ({
	useLanguageSync: mockUseLanguageSync,
}));

// ─── Imports (after vi.mock calls) ───────────────────────────────────────────

import { useAppSelector } from "~/libs/hooks/use-app-selector/use-app-selector.hook";
import { useTrueFalseGame } from "~/libs/hooks/use-true-false-game/use-true-false-game.hook";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mockUseAppSelector = vi.mocked(useAppSelector);

type TrueFalseSliceState = {
	currentLevel: null | TrueFalseGameLevelDto;
	currentStatus: (typeof DataStatus)[keyof typeof DataStatus];
	error: null | ThunkErrorPayload;
};

const renderGameHook = () => renderHook(() => useTrueFalseGame({ game: MOCK_GAME, levelId: MOCK_LEVEL_ID }));

const makeSliceState = (overrides: Partial<TrueFalseSliceState> = {}): TrueFalseSliceState => ({
	currentLevel: null,
	currentStatus: DataStatus.IDLE,
	error: null,
	...overrides,
});

const setMockState = (state: TrueFalseSliceState): void => {
	mockUseAppSelector.mockImplementation((selector) =>
		selector({ trueFalseLevels: state } as unknown as Parameters<typeof selector>[0]),
	);
};

const MOCK_GAME: GameDescriptionDto = {
	description: "A true/false game",
	icon_url: "/icon.svg",
	id: "game-1",
	key: "true_false" as GameDescriptionDto["key"],
	title: "True or False",
};

const MOCK_LEVEL_ID = 42;
const MOCK_STORAGE_KEY = `tf-${MOCK_GAME.id}-${String(MOCK_LEVEL_ID)}`;

const STATEMENT_1_ID = 101;
const STATEMENT_2_ID = 102;

const MOCK_LEVEL: TrueFalseGameLevelDto = {
	id: MOCK_LEVEL_ID,
	image_url: null,
	statements: [
		{
			explanation: null,
			explanation_audio_url: null,
			id: 101,
			is_true: true,
			level_id: MOCK_LEVEL_ID,
			statement: "Statement 1",
			statement_audio_url: null,
		},
		{
			explanation: null,
			explanation_audio_url: null,
			id: 102,
			is_true: false,
			level_id: MOCK_LEVEL_ID,
			statement: "Statement 2",
			statement_audio_url: null,
		},
	],
	text: null,
	text_audio_url: null,
	title: "Test Level",
	title_audio_url: null,
};

const MOCK_RESULTS: TrueFalseGameResultDto[] = [
	{ correct: true, explanation: null, is_true: true, statement_id: 101 },
	{ correct: false, explanation: null, is_true: false, statement_id: 102 },
];

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useTrueFalseGame", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();
		setMockState(makeSliceState());
	});

	describe("initial state", () => {
		it("should return level from redux state", () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));

			const { result } = renderGameHook();

			expect(result.current.level).toEqual(MOCK_LEVEL);
		});

		it("should return status from redux state", () => {
			setMockState(makeSliceState({ currentStatus: DataStatus.PENDING }));

			const { result } = renderGameHook();

			expect(result.current.status).toBe(DataStatus.PENDING);
		});

		it("should return error from redux state", () => {
			const mockError: ThunkErrorPayload = { message: "Something went wrong", status: HTTPCode.INTERNAL_SERVER_ERROR };
			setMockState(makeSliceState({ error: mockError }));

			const { result } = renderGameHook();

			expect(result.current.error).toEqual(mockError);
		});

		it("should return empty answers on initial render", () => {
			const { result } = renderGameHook();

			expect(result.current.answers).toEqual({});
		});

		it("should return null results on initial render", () => {
			const { result } = renderGameHook();

			expect(result.current.results).toBeNull();
		});

		it("should return isSubmitting=false on initial render", () => {
			const { result } = renderGameHook();

			expect(result.current.isSubmitting).toBe(false);
		});

		it("should return hasSubmitError=false on initial render", () => {
			const { result } = renderGameHook();

			expect(result.current.hasSubmitError).toBe(false);
		});
	});

	describe("mount effects", () => {
		it("should dispatch getLevelById on mount", () => {
			renderGameHook();

			expect(mockGetLevelById).toHaveBeenCalledWith({
				gameId: MOCK_GAME.id,
				levelId: String(MOCK_LEVEL_ID),
			});
			expect(mockDispatch).toHaveBeenCalledWith({ type: "true-false-game/get-level-by-id" });
		});

		it("should dispatch clearCurrentLevel on unmount", () => {
			const { unmount } = renderGameHook();

			unmount();

			expect(mockClearCurrentLevel).toHaveBeenCalledOnce();
			expect(mockDispatch).toHaveBeenCalledWith({ type: "true-false-game/clearCurrentLevel" });
		});
	});

	describe("localStorage", () => {
		it("should load saved answers from localStorage on mount", () => {
			const savedAnswers = { 101: true, 102: false };
			localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(savedAnswers));

			const { result } = renderGameHook();

			expect(result.current.answers).toEqual(savedAnswers);
		});

		it("should handle invalid JSON in localStorage gracefully", () => {
			localStorage.setItem(MOCK_STORAGE_KEY, "not-valid-json{{");

			const { result } = renderGameHook();

			expect(result.current.answers).toEqual({});
		});

		it("should save answers to localStorage when an answer is selected", () => {
			const { result } = renderGameHook();

			act(() => {
				result.current.handleSelect(STATEMENT_1_ID, true);
			});

			expect(localStorage.getItem(MOCK_STORAGE_KEY)).toBe(JSON.stringify({ 101: true }));
		});

		it("should not write to localStorage when answers is empty and results is null", () => {
			renderGameHook();

			expect(localStorage.getItem(MOCK_STORAGE_KEY)).toBeNull();
		});

		it("should remove answers from localStorage on handleReset", () => {
			localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify({ 101: true }));

			const { result } = renderGameHook();

			act(() => {
				result.current.handleReset();
			});

			expect(localStorage.getItem(MOCK_STORAGE_KEY)).toBeNull();
		});
	});

	describe("handleSelect", () => {
		it("should add a new answer to the answers map", () => {
			const { result } = renderGameHook();

			act(() => {
				result.current.handleSelect(STATEMENT_1_ID, true);
			});

			expect(result.current.answers).toEqual({ 101: true });
		});

		it("should update an existing answer", () => {
			const { result } = renderGameHook();

			act(() => {
				result.current.handleSelect(STATEMENT_1_ID, true);
			});
			act(() => {
				result.current.handleSelect(STATEMENT_1_ID, false);
			});

			expect(result.current.answers[STATEMENT_1_ID]).toBe(false);
		});

		it("should not change answers when results are already set", async () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));
			mockDispatch.mockReturnValue({
				unwrap: vi.fn().mockResolvedValue({ results: MOCK_RESULTS }),
			});

			const { result } = renderGameHook();

			act(() => {
				result.current.handleSelect(STATEMENT_1_ID, true);
			});

			await act(async () => {
				await result.current.handleSubmit();
			});

			const answersAfterSubmit = { ...result.current.answers };

			act(() => {
				result.current.handleSelect(STATEMENT_2_ID, false);
			});

			expect(result.current.answers).toEqual(answersAfterSubmit);
		});
	});

	describe("handleSubmit", () => {
		it("should dispatch checkAnswers with the correct payload", async () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));
			mockDispatch.mockReturnValue({
				unwrap: vi.fn().mockResolvedValue({ results: MOCK_RESULTS }),
			});

			const { result } = renderGameHook();

			act(() => {
				result.current.handleSelect(STATEMENT_1_ID, true);
				result.current.handleSelect(STATEMENT_2_ID, false);
			});

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(mockCheckAnswers).toHaveBeenCalledWith(
				expect.objectContaining({
					gameId: MOCK_GAME.id,
					levelId: String(MOCK_LEVEL_ID),
					payload: expect.objectContaining({
						answers: expect.arrayContaining([
							{ answer: true, statement_id: STATEMENT_1_ID },
							{ answer: false, statement_id: STATEMENT_2_ID },
						]) as unknown,
						level_id: MOCK_LEVEL.id,
					}) as unknown,
				}),
			);
		});

		it("should set results after successful submission", async () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));
			mockDispatch.mockReturnValue({
				unwrap: vi.fn().mockResolvedValue({ results: MOCK_RESULTS }),
			});

			const { result } = renderGameHook();

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(result.current.results).toEqual(MOCK_RESULTS);
		});

		it("should set hasSubmitError=true when submission fails", async () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));
			mockDispatch.mockReturnValue({
				unwrap: vi.fn().mockRejectedValue(new Error("Network error")),
			});

			const { result } = renderGameHook();

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(result.current.hasSubmitError).toBe(true);
		});

		it("should clear hasSubmitError before a new submission attempt", async () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));
			mockDispatch.mockReturnValueOnce({
				unwrap: vi.fn().mockRejectedValue(new Error("Network error")),
			});

			const { result } = renderGameHook();

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(result.current.hasSubmitError).toBe(true);

			const { promise: deferredResult, resolve: resolveSecondSubmit } =
				Promise.withResolvers<{ results: TrueFalseGameResultDto[] }>();

			mockDispatch.mockReturnValue({
				unwrap: vi.fn().mockReturnValue(deferredResult),
			});

			act(() => {
				void result.current.handleSubmit();
			});

			expect(result.current.hasSubmitError).toBe(false);

			await act(async () => {
				resolveSecondSubmit({ results: MOCK_RESULTS });
				await Promise.resolve();
			});

			expect(result.current.hasSubmitError).toBe(false);
		});

		it("should set isSubmitting=false after submission completes", async () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));
			mockDispatch.mockReturnValue({
				unwrap: vi.fn().mockResolvedValue({ results: MOCK_RESULTS }),
			});

			const { result } = renderGameHook();

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(result.current.isSubmitting).toBe(false);
		});

		it("should toggle isSubmitting state during submission lifecycle", async () => {
			const { promise, resolve } = Promise.withResolvers<{ results: TrueFalseGameResultDto[] }>();
			mockDispatch.mockReturnValue({
				unwrap: vi.fn().mockReturnValue(promise),
			});
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));
			
			const { result } = renderGameHook();

			act(() => {
				void result.current.handleSubmit();
			});

			expect(result.current.isSubmitting).toBe(true);

			await act(async () => {
				resolve({ results: MOCK_RESULTS });
				await Promise.resolve();
			});

			expect(result.current.isSubmitting).toBe(false);
		});

		it("should do nothing when level is null", async () => {
			setMockState(makeSliceState({ currentLevel: null }));

			const { result } = renderGameHook();

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(mockCheckAnswers).not.toHaveBeenCalled();
		});

		it("should do nothing when already submitting", () => {
			const { promise } = Promise.withResolvers<{ results: TrueFalseGameResultDto[] }>();
			mockDispatch.mockReturnValue({
				unwrap: vi.fn().mockReturnValue(promise),
			});
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));

			const { result } = renderGameHook();

			act(() => {
				void result.current.handleSubmit();
			});

			expect(result.current.isSubmitting).toBe(true);

			act(() => {
				void result.current.handleSubmit();
			});

			expect(mockCheckAnswers).toHaveBeenCalledOnce();
		});

		it("should do nothing when results are already set", async () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));
			mockDispatch.mockReturnValue({
				unwrap: vi.fn().mockResolvedValue({ results: MOCK_RESULTS }),
			});

			const { result } = renderGameHook();

			await act(async () => {
				await result.current.handleSubmit();
			});

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(mockCheckAnswers).toHaveBeenCalledOnce();
		});
	});

	describe("handleReset", () => {
		it("should clear answers", () => {
			const { result } = renderGameHook();

			act(() => {
				result.current.handleSelect(STATEMENT_1_ID, true);
			});
			act(() => {
				result.current.handleReset();
			});

			expect(result.current.answers).toEqual({});
		});

		it("should clear results", async () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));
			mockDispatch.mockReturnValue({
				unwrap: vi.fn().mockResolvedValue({ results: MOCK_RESULTS }),
			});

			const { result } = renderGameHook();

			await act(async () => {
				await result.current.handleSubmit();
			});
			act(() => {
				result.current.handleReset();
			});

			expect(result.current.results).toBeNull();
		});

		it("should clear hasSubmitError", async () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));
			mockDispatch.mockReturnValue({
				unwrap: vi.fn().mockRejectedValue(new Error("Network error")),
			});

			const { result } = renderGameHook();

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(result.current.hasSubmitError).toBe(true);

			act(() => {
				result.current.handleReset();
			});

			expect(result.current.hasSubmitError).toBe(false);
		});
	});

	describe("allAnswered", () => {
		it("should be false when level is null", () => {
			setMockState(makeSliceState({ currentLevel: null }));

			const { result } = renderGameHook();

			expect(result.current.allAnswered).toBe(false);
		});

		it("should be false when level has no statements", () => {
			const emptyLevel: TrueFalseGameLevelDto = { ...MOCK_LEVEL, statements: [] };
			setMockState(makeSliceState({ currentLevel: emptyLevel }));

			const { result } = renderGameHook();

			expect(result.current.allAnswered).toBe(false);
		});

		it("should be false when not all statements are answered", () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));

			const { result } = renderGameHook();

			act(() => {
				result.current.handleSelect(STATEMENT_1_ID, true);
			});

			expect(result.current.allAnswered).toBe(false);
		});

		it("should be true when all statements are answered", () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));

			const { result } = renderGameHook();

			act(() => {
				result.current.handleSelect(STATEMENT_1_ID, true);
				result.current.handleSelect(STATEMENT_2_ID, false);
			});

			expect(result.current.allAnswered).toBe(true);
		});
	});

	describe("errorKind", () => {
		it("should return null when error is null", () => {
			setMockState(makeSliceState({ error: null }));

			const { result } = renderGameHook();

			expect(result.current.errorKind).toBeNull();
		});

		it("should return ErrorKind.NOT_FOUND when error status is 404", () => {
			const notFoundError: ThunkErrorPayload = {
				message: "Not Found",
				status: HTTPCode.NOT_FOUND,
			};
			setMockState(makeSliceState({ error: notFoundError }));

			const { result } = renderGameHook();

			expect(result.current.errorKind).toBe(ErrorKind.NOT_FOUND);
		});

		it("should return ErrorKind.GENERIC for non-404 error statuses", () => {
			const serverError: ThunkErrorPayload = { message: "Internal Server Error", status: HTTPCode.INTERNAL_SERVER_ERROR };
			setMockState(makeSliceState({ error: serverError }));

			const { result } = renderGameHook();

			expect(result.current.errorKind).toBe(ErrorKind.GENERIC);
		});
	});

	describe("useLanguageSync", () => {
		it("should register a callback with useLanguageSync on mount", () => {
			renderGameHook();

			expect(mockUseLanguageSync).toHaveBeenCalledOnce();
		});

		it("should dispatch getLevelById when the language sync callback is triggered", () => {
			let capturedCallback: (() => void) | undefined;
			mockUseLanguageSync.mockImplementation((callback: () => void) => {
				capturedCallback = callback;
			});

			renderGameHook();

			const dispatchCallCountBeforeSync = mockDispatch.mock.calls.length;

			expect(capturedCallback).toBeDefined();

			act(() => {
				if (capturedCallback) {
					capturedCallback();
				}
			});

			expect(mockDispatch.mock.calls.length).toBeGreaterThan(dispatchCallCountBeforeSync);
			expect(mockGetLevelById).toHaveBeenCalledWith({
				gameId: MOCK_GAME.id,
				levelId: String(MOCK_LEVEL_ID),
			});
		});
	});
});
