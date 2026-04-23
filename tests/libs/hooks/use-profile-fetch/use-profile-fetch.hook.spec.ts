/**
 * @vitest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DataStatus } from "~/libs/enums/enums";
import { type UserProfileDto } from "~/modules/profile/profile";

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const { mockDispatch, mockFetchProfileAction } = vi.hoisted(() => {
	const mockDispatch = vi.fn();
	const mockFetchProfileAction = { type: "profile/fetchProfile" };

	return { mockDispatch, mockFetchProfileAction };
});

vi.mock("~/libs/hooks/use-app-dispatch/use-app-dispatch.hook", () => ({
	useAppDispatch: () => mockDispatch,
}));

vi.mock("~/libs/hooks/use-app-selector/use-app-selector.hook", () => ({
	useAppSelector: vi.fn(),
}));

vi.mock("~/modules/profile/profile", () => ({
	fetchProfile: vi.fn(() => mockFetchProfileAction),
}));

// ─── Imports (after vi.mock calls) ───────────────────────────────────────────

import { useAppSelector } from "~/libs/hooks/use-app-selector/use-app-selector.hook";
import { fetchProfile } from "~/modules/profile/profile";

import { useProfileFetch } from "~/libs/hooks/use-profile-fetch/use-profile-fetch.hook";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mockUseAppSelector = vi.mocked(useAppSelector);
const mockFetchProfile = vi.mocked(fetchProfile);

type DataStatusValue = (typeof DataStatus)[keyof typeof DataStatus];

type ProfileSliceState = {
	dataStatus: DataStatusValue;
	error: null | string;
	profile: null | UserProfileDto;
};

const makeState = (overrides: Partial<ProfileSliceState> = {}): ProfileSliceState => ({
	dataStatus: DataStatus.IDLE,
	error: null,
	profile: null,
	...overrides,
});

const MOCK_PROFILE: UserProfileDto = {
	email: "test@example.com",
	name: "Test User",
	stats: {
		completedLevels: 5,
		correctAnswersPercentage: 75,
		totalLevels: 10,
		totalScore: 200,
	},
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useProfileFetch", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("isLoading", () => {
		it("should return isLoading=true when dataStatus is IDLE", () => {
			mockUseAppSelector.mockReturnValue(makeState({ dataStatus: DataStatus.IDLE }));

			const { result } = renderHook(() => useProfileFetch());

			expect(result.current.isLoading).toBe(true);
		});

		it("should return isLoading=true when dataStatus is PENDING", () => {
			mockUseAppSelector.mockReturnValue(makeState({ dataStatus: DataStatus.PENDING }));

			const { result } = renderHook(() => useProfileFetch());

			expect(result.current.isLoading).toBe(true);
		});

		it("should return isLoading=false when dataStatus is FULFILLED", () => {
			mockUseAppSelector.mockReturnValue(makeState({ dataStatus: DataStatus.FULFILLED }));

			const { result } = renderHook(() => useProfileFetch());

			expect(result.current.isLoading).toBe(false);
		});

		it("should return isLoading=false when dataStatus is REJECTED", () => {
			mockUseAppSelector.mockReturnValue(
				makeState({ dataStatus: DataStatus.REJECTED, error: "Error" }),
			);

			const { result } = renderHook(() => useProfileFetch());

			expect(result.current.isLoading).toBe(false);
		});
	});

	describe("isError", () => {
		it("should return isError=false when dataStatus is not REJECTED", () => {
			mockUseAppSelector.mockReturnValue(makeState({ dataStatus: DataStatus.FULFILLED }));

			const { result } = renderHook(() => useProfileFetch());

			expect(result.current.isError).toBe(false);
		});

		it("should return isError=true when dataStatus is REJECTED", () => {
			mockUseAppSelector.mockReturnValue(
				makeState({ dataStatus: DataStatus.REJECTED, error: "Failed to fetch" }),
			);

			const { result } = renderHook(() => useProfileFetch());

			expect(result.current.isError).toBe(true);
		});
	});

	describe("data", () => {
		it("should return null data before fetch completes", () => {
			mockUseAppSelector.mockReturnValue(makeState({ dataStatus: DataStatus.PENDING }));

			const { result } = renderHook(() => useProfileFetch());

			expect(result.current.data).toBeNull();
		});

		it("should return profile data when fetch is fulfilled", () => {
			mockUseAppSelector.mockReturnValue(
				makeState({ dataStatus: DataStatus.FULFILLED, profile: MOCK_PROFILE }),
			);

			const { result } = renderHook(() => useProfileFetch());

			expect(result.current.data).toEqual(MOCK_PROFILE);
		});
	});

	describe("error", () => {
		it("should return null error when fetch is fulfilled", () => {
			mockUseAppSelector.mockReturnValue(
				makeState({ dataStatus: DataStatus.FULFILLED, profile: MOCK_PROFILE }),
			);

			const { result } = renderHook(() => useProfileFetch());

			expect(result.current.error).toBeNull();
		});

		it("should return null error when isLoading is true", () => {
			mockUseAppSelector.mockReturnValue(
				makeState({ dataStatus: DataStatus.PENDING, error: null }),
			);

			const { result } = renderHook(() => useProfileFetch());

			expect(result.current.isLoading).toBe(true);
			expect(result.current.error).toBeNull();
		});

		it("should return error message when fetch is rejected", () => {
			mockUseAppSelector.mockReturnValue(
				makeState({ dataStatus: DataStatus.REJECTED, error: "Failed to fetch profile" }),
			);

			const { result } = renderHook(() => useProfileFetch());

			expect(result.current.error).toBe("Failed to fetch profile");
		});
	});

	describe("fetchProfile dispatch", () => {
		it("should dispatch fetchProfile on mount", () => {
			mockUseAppSelector.mockReturnValue(makeState());

			renderHook(() => useProfileFetch());

			expect(mockFetchProfile).toHaveBeenCalledOnce();
			expect(mockDispatch).toHaveBeenCalledWith(mockFetchProfileAction);
		});
	});
});
