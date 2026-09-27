/**
 * @vitest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DataStatus } from "~/libs/enums/enums";
import { type EntitlementResponseDto } from "~/modules/entitlement/libs/types/types";

vi.mock("~/libs/hooks/use-app-selector/use-app-selector.hook", () => ({
	useAppSelector: vi.fn(),
}));

vi.mock("~/libs/hooks/use-app-dispatch/use-app-dispatch.hook", () => ({
	useAppDispatch: vi.fn(),
}));

import { useAppDispatch } from "~/libs/hooks/use-app-dispatch/use-app-dispatch.hook";
import { useAppSelector } from "~/libs/hooks/use-app-selector/use-app-selector.hook";
import { useEntitlement } from "~/modules/entitlement/hooks/use-entitlement/use-entitlement.hook";

const mockUseAppSelector = vi.mocked(useAppSelector);
const mockUseAppDispatch = vi.mocked(useAppDispatch);

const ENTITLEMENT = {
	currency: "EUR",
	is_exempt: false,
	limits: { completed: 1, started: 3 },
	purchasing_enabled: true,
	remaining: { completed: 1, started: 2 },
	resets_at: "2026-08-24T00:00:00Z",
	subscription: null,
	tier: "free",
	tiers: [],
} as unknown as EntitlementResponseDto;

type SliceState = {
	dataStatus: (typeof DataStatus)[keyof typeof DataStatus];
	entitlement: EntitlementResponseDto | null;
	error: null | { message: string };
};

const USER = { email: "test@example.com", has_password: true, id: 1, is_admin: false, name: "Test User" };

const selectFrom = (state: SliceState, user: null | typeof USER = USER): void => {
	mockUseAppSelector.mockImplementation((selector: unknown) =>
		(selector as (root: unknown) => unknown)({ auth: { user }, entitlement: state })
	);
};

describe("useEntitlement", () => {
	it("reports a loaded snapshot", () => {
		selectFrom({ dataStatus: DataStatus.FULFILLED, entitlement: ENTITLEMENT, error: null });

		const { result } = renderHook(() => useEntitlement());

		expect(result.current.data).toEqual(ENTITLEMENT);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isError).toBe(false);
	});

	it("treats the first fetch as loading before it starts", () => {
		selectFrom({ dataStatus: DataStatus.IDLE, entitlement: null, error: null });

		const { result } = renderHook(() => useEntitlement());

		expect(result.current.isLoading).toBe(true);
		expect(result.current.isError).toBe(false);
	});

	// Without a signed-in account the shell never fetches, so calling IDLE
	// "loading" would leave a spinner turning for the rest of the session.
	it("is not loading for a visitor nobody will fetch for", () => {
		selectFrom({ dataStatus: DataStatus.IDLE, entitlement: null, error: null }, null);

		const { result } = renderHook(() => useEntitlement());

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isError).toBe(false);
		expect(result.current.data).toBeNull();
	});

	// The whole reason the hook reports readiness instead of the raw status: a
	// caller branching on REJECTED alone would hide the snapshot the slice
	// deliberately kept, which is the emptiness it was keeping it to avoid.
	it("is not an error while a snapshot survives a failed refresh", () => {
		selectFrom({
			dataStatus: DataStatus.REJECTED,
			entitlement: ENTITLEMENT,
			error: { message: "Network error" },
		});

		const { result } = renderHook(() => useEntitlement());

		expect(result.current.data).toEqual(ENTITLEMENT);
		expect(result.current.isError).toBe(false);
	});

	it("is an error when the refusal left nothing to show", () => {
		selectFrom({
			dataStatus: DataStatus.REJECTED,
			entitlement: null,
			error: { message: "Network error" },
		});

		const { result } = renderHook(() => useEntitlement());

		expect(result.current.isError).toBe(true);
		expect(result.current.error).toEqual({ message: "Network error" });
	});

	it("does not dispatch anything", () => {
		const dispatch = vi.fn();
		mockUseAppDispatch.mockReturnValue(dispatch as never);
		selectFrom({ dataStatus: DataStatus.FULFILLED, entitlement: ENTITLEMENT, error: null });

		renderHook(() => useEntitlement());

		expect(dispatch).not.toHaveBeenCalled();
	});
});
