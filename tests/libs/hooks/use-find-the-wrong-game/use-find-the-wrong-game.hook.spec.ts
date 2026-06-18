/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
	ErrorKind,
	type FindTheWrongLevelDto,
	InteractionMode,
	type SubmitAttemptResponseDto,
} from "~/games/find-the-wrong/find-the-wrong";
import { DataStatus } from "~/libs/enums/enums";
import { HTTPCode } from "~/libs/modules/http/http";
import { type GameDescriptionDto, type ThunkErrorPayload } from "~/libs/types/types";

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const { mockClearCurrentLevel, mockDispatch, mockGetLevelById, mockSubmitAttempt, mockUseLanguageSync } =
	vi.hoisted(() => {
		const mockGetLevelById = vi.fn().mockReturnValue({ type: "find-the-wrong-game/get-level-by-id" });
		const mockSubmitAttempt = vi.fn().mockReturnValue({ type: "find-the-wrong-game/submit-attempt" });
		const mockClearCurrentLevel = vi
			.fn()
			.mockReturnValue({ type: "find-the-wrong-game/clearCurrentLevel" });
		const mockDispatch = vi.fn();
		const mockUseLanguageSync = vi.fn<(callback: () => void) => void>();

		return {
			mockClearCurrentLevel,
			mockDispatch,
			mockGetLevelById,
			mockSubmitAttempt,
			mockUseLanguageSync,
		};
	});

vi.mock("~/games/find-the-wrong/api/find-the-wrong-game", () => ({
	actions: {
		clearCurrentLevel: mockClearCurrentLevel,
		getLevelById: mockGetLevelById,
		submitAttempt: mockSubmitAttempt,
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

vi.mock("sonner", () => ({
	toast: { error: vi.fn(), info: vi.fn(), success: vi.fn() },
}));

// ─── Imports (after vi.mock calls) ───────────────────────────────────────────

import { toast } from "sonner";

import { useAppSelector } from "~/libs/hooks/use-app-selector/use-app-selector.hook";
import { useFindTheWrongGame } from "~/libs/hooks/use-find-the-wrong-game/use-find-the-wrong-game.hook";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mockUseAppSelector = vi.mocked(useAppSelector);

type SliceState = {
	currentLevel: FindTheWrongLevelDto | null;
	currentStatus: (typeof DataStatus)[keyof typeof DataStatus];
	error: null | ThunkErrorPayload;
};

const MOCK_GAME: GameDescriptionDto = {
	description: "A find-the-wrong game",
	icon_url: "/icon.svg",
	id: "game-1",
	key: "find_the_wrong" as GameDescriptionDto["key"],
	title: "Find the Wrong",
};

const MOCK_LEVEL_ID = 42;
const ITEM_ID = 10;

const MOCK_LEVEL: FindTheWrongLevelDto = {
	id: MOCK_LEVEL_ID,
	image_url: "/image.png",
	items: [
		{
			id: ITEM_ID,
			name: "Apple",
			name_audio_url: null,
			polygon: [
				[0, 0],
				[1, 0],
				[1, 1],
				[0, 1],
			],
		},
	],
	title: "Test Level",
	title_audio_url: null,
};

const MOCK_RESPONSE: SubmitAttemptResponseDto = {
	found_items: [],
	missed_items: [],
	score: 1,
	total_questions: 1,
};

// Closed loop that tightly matches the item polygon (high IoU) → counts as found.
const STROKE_AROUND_ITEM = [
	[0, 0],
	[1, 0],
	[1, 1],
	[0, 1],
	[0, 0],
] as [number, number][];

const renderGameHook = () =>
	renderHook(() => useFindTheWrongGame({ game: MOCK_GAME, levelId: MOCK_LEVEL_ID }));

const makeSliceState = (overrides: Partial<SliceState> = {}): SliceState => ({
	currentLevel: null,
	currentStatus: DataStatus.IDLE,
	error: null,
	...overrides,
});

const setMockState = (state: SliceState): void => {
	mockUseAppSelector.mockImplementation((selector) =>
		selector({ findTheWrongLevels: state } as unknown as Parameters<typeof selector>[0])
	);
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useFindTheWrongGame", () => {
	beforeEach(() => {
		vi.clearAllMocks();
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

		it("should start with empty strokes and no submit result", () => {
			const { result } = renderGameHook();

			expect(result.current.strokes).toEqual([]);
			expect(result.current.submitResult).toBeNull();
			expect(result.current.isSubmitting).toBe(false);
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
		});

		it("should dispatch clearCurrentLevel on unmount", () => {
			const { unmount } = renderGameHook();

			unmount();

			expect(mockClearCurrentLevel).toHaveBeenCalledOnce();
		});
	});

	describe("handleSubmit", () => {
		it("should do nothing when there are no strokes", async () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));

			const { result } = renderGameHook();

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(mockSubmitAttempt).not.toHaveBeenCalled();
		});

		it("should do nothing when level is null", async () => {
			setMockState(makeSliceState({ currentLevel: null }));

			const { result } = renderGameHook();

			act(() => {
				result.current.addStroke(STROKE_AROUND_ITEM);
			});

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(mockSubmitAttempt).not.toHaveBeenCalled();
		});

		it("should dispatch submitAttempt with a payload built from the match result", async () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));
			mockDispatch.mockReturnValue({ unwrap: vi.fn().mockResolvedValue(MOCK_RESPONSE) });

			const { result } = renderGameHook();

			act(() => {
				result.current.addStroke(STROKE_AROUND_ITEM);
			});

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(mockSubmitAttempt).toHaveBeenCalledWith(
				expect.objectContaining({
					gameId: MOCK_GAME.id,
					levelId: String(MOCK_LEVEL_ID),
					payload: expect.objectContaining({
						found: expect.arrayContaining([
							expect.objectContaining({ item_id: ITEM_ID }),
						]) as unknown,
						missed_item_ids: [],
					}) as unknown,
				})
			);
		});

		it("should store the submit result on success", async () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));
			mockDispatch.mockReturnValue({ unwrap: vi.fn().mockResolvedValue(MOCK_RESPONSE) });

			const { result } = renderGameHook();

			act(() => {
				result.current.addStroke(STROKE_AROUND_ITEM);
			});

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(result.current.submitResult).toEqual(MOCK_RESPONSE);
		});

		it("should set hasSubmitError=true when submission fails", async () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));
			mockDispatch.mockReturnValue({
				unwrap: vi.fn().mockRejectedValue(new Error("Network error")),
			});

			const { result } = renderGameHook();

			act(() => {
				result.current.addStroke(STROKE_AROUND_ITEM);
			});

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(result.current.hasSubmitError).toBe(true);
		});

		it("should do nothing when a result is already present", async () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));
			mockDispatch.mockReturnValue({ unwrap: vi.fn().mockResolvedValue(MOCK_RESPONSE) });

			const { result } = renderGameHook();

			act(() => {
				result.current.addStroke(STROKE_AROUND_ITEM);
			});

			await act(async () => {
				await result.current.handleSubmit();
			});

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(mockSubmitAttempt).toHaveBeenCalledOnce();
		});
	});

	describe("handleReset", () => {
		it("should clear strokes and submit result", async () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));
			mockDispatch.mockReturnValue({ unwrap: vi.fn().mockResolvedValue(MOCK_RESPONSE) });

			const { result } = renderGameHook();

			act(() => {
				result.current.addStroke(STROKE_AROUND_ITEM);
			});

			await act(async () => {
				await result.current.handleSubmit();
			});

			act(() => {
				result.current.handleReset();
			});

			expect(result.current.strokes).toEqual([]);
			expect(result.current.submitResult).toBeNull();
			expect(result.current.hasSubmitError).toBe(false);
		});
	});

	describe("stroke capture", () => {
		it("keeps a closed loop", () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));

			const { result } = renderGameHook();

			act(() => {
				result.current.addStroke(STROKE_AROUND_ITEM);
			});

			expect(result.current.strokes).toHaveLength(1);
		});

		it("discards an open contour that can never score", () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));

			const { result } = renderGameHook();

			const openArc = [
				[0, 0],
				[0.5, 0.1],
				[1, 0],
			] as [number, number][];

			act(() => {
				result.current.addStroke(openArc);
			});

			expect(result.current.strokes).toEqual([]);
			expect(result.current.hasMarks).toBe(false);
			expect(vi.mocked(toast.info)).toHaveBeenCalledOnce();
		});
	});

	describe("marker mode", () => {
		it("defaults to circle mode", () => {
			const { result } = renderGameHook();

			expect(result.current.interactionMode).toBe(InteractionMode.CIRCLE);
		});

		it("selecting the already-active mode is a no-op (keeps marks)", () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));

			const { result } = renderGameHook();

			act(() => {
				result.current.addStroke(STROKE_AROUND_ITEM);
			});

			expect(result.current.hasMarks).toBe(true);

			// Re-selecting CIRCLE (the current mode) must not wipe the stroke.
			act(() => {
				result.current.setInteractionMode(InteractionMode.CIRCLE);
			});

			expect(result.current.interactionMode).toBe(InteractionMode.CIRCLE);
			expect(result.current.hasMarks).toBe(true);
		});

		it("switching to marker mode clears existing strokes", () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));

			const { result } = renderGameHook();

			act(() => {
				result.current.addStroke(STROKE_AROUND_ITEM);
			});

			expect(result.current.hasMarks).toBe(true);

			act(() => {
				result.current.setInteractionMode(InteractionMode.MARKER);
			});

			expect(result.current.interactionMode).toBe(InteractionMode.MARKER);
			expect(result.current.strokes).toEqual([]);
			expect(result.current.hasMarks).toBe(false);
		});

		it("does nothing on submit when there are no markers", async () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));

			const { result } = renderGameHook();

			act(() => {
				result.current.setInteractionMode(InteractionMode.MARKER);
			});

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(mockSubmitAttempt).not.toHaveBeenCalled();
		});

		it("submits a marker payload built from taps inside an item", async () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));
			mockDispatch.mockReturnValue({ unwrap: vi.fn().mockResolvedValue(MOCK_RESPONSE) });

			const { result } = renderGameHook();

			act(() => {
				result.current.setInteractionMode(InteractionMode.MARKER);
			});

			act(() => {
				result.current.toggleMarker([0.5, 0.5]);
			});

			expect(result.current.markers).toHaveLength(1);

			await act(async () => {
				await result.current.handleSubmit();
			});

			expect(mockSubmitAttempt).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: expect.objectContaining({
						found: expect.arrayContaining([
							expect.objectContaining({ item_id: ITEM_ID }),
						]) as unknown,
						interaction_mode: "marker",
					}) as unknown,
				})
			);
		});

		it("exposes markLimit as the item count and caps markers at it", () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));

			const { result } = renderGameHook();

			expect(result.current.markLimit).toBe(1);
			expect(result.current.markCount).toBe(0);

			act(() => {
				result.current.setInteractionMode(InteractionMode.MARKER);
			});

			act(() => {
				result.current.toggleMarker([0.5, 0.5]);
			});

			expect(result.current.markCount).toBe(1);

			// A further tap elsewhere is blocked — the level has a single item.
			act(() => {
				result.current.toggleMarker([0.1, 0.9]);
			});

			expect(result.current.markCount).toBe(1);
		});

		it("toggles a marker off when tapped again nearby", () => {
			setMockState(makeSliceState({ currentLevel: MOCK_LEVEL }));

			const { result } = renderGameHook();

			act(() => {
				result.current.setInteractionMode(InteractionMode.MARKER);
			});

			act(() => {
				result.current.toggleMarker([0.5, 0.5]);
			});

			expect(result.current.markers).toHaveLength(1);

			act(() => {
				result.current.toggleMarker([0.5, 0.5]);
			});

			expect(result.current.markers).toHaveLength(0);
		});
	});

	describe("errorKind", () => {
		it("should return null when there is no error", () => {
			const { result } = renderGameHook();

			expect(result.current.errorKind).toBeNull();
		});

		it("should map a 404 error to ErrorKind.NOT_FOUND", () => {
			setMockState(makeSliceState({ error: { message: "Not Found", status: HTTPCode.NOT_FOUND } }));

			const { result } = renderGameHook();

			expect(result.current.errorKind).toBe(ErrorKind.NOT_FOUND);
		});

		it("should map other error statuses to ErrorKind.GENERIC", () => {
			setMockState(
				makeSliceState({
					error: { message: "Server Error", status: HTTPCode.INTERNAL_SERVER_ERROR },
				})
			);

			const { result } = renderGameHook();

			expect(result.current.errorKind).toBe(ErrorKind.GENERIC);
		});
	});

	describe("useLanguageSync", () => {
		it("should register a callback that refetches the level", () => {
			let capturedCallback: (() => void) | undefined;
			mockUseLanguageSync.mockImplementation((callback: () => void) => {
				capturedCallback = callback;
			});

			renderGameHook();

			expect(capturedCallback).toBeDefined();

			act(() => {
				capturedCallback?.();
			});

			expect(mockGetLevelById).toHaveBeenCalledWith({
				gameId: MOCK_GAME.id,
				levelId: String(MOCK_LEVEL_ID),
			});
		});
	});
});
