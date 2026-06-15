/**
 * @vitest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DataStatus } from "~/libs/enums/enums";

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const { mockAbort, mockDispatch, mockUseLanguageSync } = vi.hoisted(() => {
	const mockAbort = vi.fn();
	const mockDispatch = vi.fn(() => ({ abort: mockAbort }));
	const mockUseLanguageSync = vi.fn<(callback: () => void) => void>();

	return { mockAbort, mockDispatch, mockUseLanguageSync };
});

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
import { useFetchById } from "~/libs/hooks/use-fetch-by-id/use-fetch-by-id.hook";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mockUseAppSelector = vi.mocked(useAppSelector);

type TestState = {
	data: null | string;
	loadedId: null | string;
	status: (typeof DataStatus)[keyof typeof DataStatus];
};

const setMockState = (state: TestState): void => {
	mockUseAppSelector.mockImplementation((selector) =>
		selector(state as unknown as Parameters<typeof selector>[0])
	);
};

const createFetch = vi.fn((id: string) => ({ id, type: "test/fetch" }));

const renderFetchById = (id?: string) =>
	renderHook((current: string | undefined) =>
		useFetchById<string>({
			createFetch: createFetch as never,
			id: current,
			selectData: (state) => (state as unknown as TestState).data,
			selectLoadedId: (state) => (state as unknown as TestState).loadedId,
			selectStatus: (state) => (state as unknown as TestState).status,
		}),
	{ initialProps: id });

describe("useFetchById", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("fetches on mount when nothing is cached", () => {
		setMockState({ data: null, loadedId: null, status: DataStatus.IDLE });

		const { result } = renderFetchById("1");

		expect(createFetch).toHaveBeenCalledWith("1");
		expect(result.current.data).toBeNull();
		expect(result.current.isLoading).toBe(true);
		expect(result.current.hasError).toBe(false);
	});

	it("does not fetch when cached id already matches", () => {
		setMockState({ data: "game-1", loadedId: "1", status: DataStatus.FULFILLED });

		const { result } = renderFetchById("1");

		expect(createFetch).not.toHaveBeenCalled();
		expect(result.current.data).toBe("game-1");
		expect(result.current.isLoading).toBe(false);
		expect(result.current.hasError).toBe(false);
	});

	it("refetches when the id changes", () => {
		setMockState({ data: "game-1", loadedId: "1", status: DataStatus.FULFILLED });

		const { rerender } = renderFetchById("1");
		rerender("2");

		expect(createFetch).toHaveBeenCalledWith("2");
	});

	it("aborts the previous in-flight request before refetching", () => {
		setMockState({ data: null, loadedId: null, status: DataStatus.IDLE });

		const { rerender } = renderFetchById("1");
		rerender("2");

		expect(mockAbort).toHaveBeenCalled();
	});

	it("aborts the in-flight request on unmount", () => {
		setMockState({ data: null, loadedId: null, status: DataStatus.IDLE });

		const { unmount } = renderFetchById("1");
		unmount();

		expect(mockAbort).toHaveBeenCalled();
	});

	it("never exposes data cached for a different id", () => {
		setMockState({ data: "game-1", loadedId: "1", status: DataStatus.FULFILLED });

		const { result } = renderFetchById("2");

		expect(result.current.data).toBeNull();
		expect(result.current.isLoading).toBe(true);
	});

	it("treats undefined id as not loading and does not fetch", () => {
		setMockState({ data: "game-1", loadedId: "1", status: DataStatus.FULFILLED });

		const { result } = renderFetchById();

		expect(createFetch).not.toHaveBeenCalled();
		expect(result.current.data).toBeNull();
		expect(result.current.isLoading).toBe(false);
	});

	it("reports an error and stops loading when the current id's fetch rejects", () => {
		// Realistic transition: the fetch runs (PENDING) — marking the attempted
		// id — then rejects, so the error is attributed to the current id.
		setMockState({ data: null, loadedId: null, status: DataStatus.PENDING });
		const { rerender, result } = renderFetchById("1");

		setMockState({ data: null, loadedId: null, status: DataStatus.REJECTED });
		rerender("1");

		expect(result.current.isLoading).toBe(false);
		expect(result.current.hasError).toBe(true);
	});

	it("does not attribute a REJECTED status from another id to a matched id", () => {
		// Levels for "2" are cached (matched), but the global status is REJECTED
		// from a later, different id's failed fetch. The matched data must show
		// without a spurious error.
		setMockState({ data: "game-2", loadedId: "2", status: DataStatus.REJECTED });

		const { result } = renderFetchById("2");

		expect(result.current.data).toBe("game-2");
		expect(result.current.hasError).toBe(false);
		expect(result.current.isLoading).toBe(false);
	});

	it("registers a language-sync callback that refetches", () => {
		setMockState({ data: "game-1", loadedId: "1", status: DataStatus.FULFILLED });

		let capturedCallback: (() => void) | undefined;
		mockUseLanguageSync.mockImplementation((callback: () => void) => {
			capturedCallback = callback;
		});

		renderFetchById("1");

		expect(capturedCallback).toBeDefined();

		act(() => {
			capturedCallback?.();
		});

		expect(createFetch).toHaveBeenCalledWith("1");
	});
});
