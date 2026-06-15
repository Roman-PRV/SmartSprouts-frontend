/**
 * @vitest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DataStatus } from "~/libs/enums/enums";

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const { mockDispatch, mockGetLevelsList, mockUseLanguageSync } = vi.hoisted(() => {
	const mockGetLevelsList = vi.fn((id: string) => ({ payload: id, type: "games/get-levels" }));
	const mockDispatch = vi.fn();
	const mockUseLanguageSync = vi.fn<(callback: () => void) => void>();

	return { mockDispatch, mockGetLevelsList, mockUseLanguageSync };
});

vi.mock("~/modules/games/slices/actions", () => ({
	getLevelsList: mockGetLevelsList,
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
import { useLevelsFetch } from "~/libs/hooks/use-levels-fetch/use-levels-fetch.hook";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mockUseAppSelector = vi.mocked(useAppSelector);

type GamesState = {
	currentLevelsGameId: null | string;
	levelsStatus: (typeof DataStatus)[keyof typeof DataStatus];
};

const setMockState = (state: GamesState): void => {
	mockUseAppSelector.mockImplementation((selector) =>
		selector({ games: state } as unknown as Parameters<typeof selector>[0])
	);
};

const renderLevelsFetch = (id: string | undefined) =>
	renderHook((current: string | undefined) => useLevelsFetch(current), { initialProps: id });

describe("useLevelsFetch", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("fetches on mount when no levels are cached", () => {
		setMockState({ currentLevelsGameId: null, levelsStatus: DataStatus.IDLE });

		const { result } = renderLevelsFetch("1");

		expect(mockGetLevelsList).toHaveBeenCalledWith("1");
		expect(result.current.isLoading).toBe(true);
	});

	it("does not refetch when cached levels already belong to the id", () => {
		setMockState({ currentLevelsGameId: "1", levelsStatus: DataStatus.FULFILLED });

		const { result } = renderLevelsFetch("1");

		expect(mockGetLevelsList).not.toHaveBeenCalled();
		expect(result.current.isLoading).toBe(false);
	});

	it("does not dispatch again on rerender with the same id", () => {
		setMockState({ currentLevelsGameId: "1", levelsStatus: DataStatus.FULFILLED });

		const { rerender } = renderLevelsFetch("1");
		rerender("1");

		expect(mockGetLevelsList).not.toHaveBeenCalled();
	});

	it("refetches when the id changes to a game whose levels are not cached", () => {
		setMockState({ currentLevelsGameId: "1", levelsStatus: DataStatus.FULFILLED });

		const { rerender } = renderLevelsFetch("1");
		rerender("2");

		expect(mockGetLevelsList).toHaveBeenCalledWith("2");
	});

	it("treats levels cached for a different id as loading (no stale levels exposed)", () => {
		setMockState({ currentLevelsGameId: "1", levelsStatus: DataStatus.FULFILLED });

		const { result } = renderLevelsFetch("2");

		expect(result.current.isLoading).toBe(true);
	});

	it("stops loading on rejection so the consumer can show an error", () => {
		setMockState({ currentLevelsGameId: null, levelsStatus: DataStatus.REJECTED });

		const { result } = renderLevelsFetch("1");

		expect(result.current.isLoading).toBe(false);
	});

	it("registers a language-sync callback that refetches the levels", () => {
		setMockState({ currentLevelsGameId: "1", levelsStatus: DataStatus.FULFILLED });

		let capturedCallback: (() => void) | undefined;
		mockUseLanguageSync.mockImplementation((callback: () => void) => {
			capturedCallback = callback;
		});

		renderLevelsFetch("1");

		expect(capturedCallback).toBeDefined();

		act(() => {
			capturedCallback?.();
		});

		expect(mockGetLevelsList).toHaveBeenCalledWith("1");
	});
});
