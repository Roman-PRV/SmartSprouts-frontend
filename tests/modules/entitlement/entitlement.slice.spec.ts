import { describe, expect, it, vi } from "vitest";

import { DataStatus } from "~/libs/enums/enums";
import { type AsyncThunkConfig } from "~/libs/types/async-thunk-config.type";
import { type ThunkErrorPayload } from "~/libs/types/types";
import { getEntitlement } from "~/modules/entitlement/entitlement";
import { TierKey } from "~/modules/entitlement/libs/enums/enums";
import { type EntitlementResponseDto } from "~/modules/entitlement/libs/types/types";
import { reducer } from "~/modules/entitlement/slices/entitlement.slice";

type ThunkDispatch = AsyncThunkConfig["dispatch"];
type ThunkExtra = AsyncThunkConfig["extra"];
type ThunkGetState = () => AsyncThunkConfig["state"];

const mockDispatch = vi.fn() as unknown as ThunkDispatch;
const mockGetState = vi.fn() as unknown as ThunkGetState;

const ENTITLEMENT: EntitlementResponseDto = {
	currency: "EUR",
	is_exempt: false,
	limits: { completed: 1, started: 3 },
	purchasing_enabled: true,
	remaining: { completed: 1, started: 2 },
	resets_at: "2026-08-24T00:00:00Z",
	subscription: null,
	tier: TierKey.FREE,
	tiers: [
		{ key: TierKey.FREE, limits: { completed: 1, started: 3 }, price_minor: 0 },
		{ key: TierKey.UNLIMITED, limits: { completed: null, started: null }, price_minor: 1000 },
	],
};

describe("entitlement slice", () => {
	const initialState = {
		dataStatus: DataStatus.IDLE,
		entitlement: null,
		error: null,
	};

	describe("reducer", () => {
		it("returns the initial state", () => {
			expect(reducer(undefined, { type: "UNKNOWN_ACTION" })).toEqual(initialState);
		});

		it("handles getEntitlement.pending action", () => {
			const state = reducer(initialState, { type: getEntitlement.pending.type });

			expect(state.dataStatus).toBe(DataStatus.PENDING);
			expect(state.error).toBeNull();
		});

		it("handles getEntitlement.fulfilled action", () => {
			const action = { payload: ENTITLEMENT, type: getEntitlement.fulfilled.type };
			const state = reducer(initialState, action);

			expect(state.dataStatus).toBe(DataStatus.FULFILLED);
			expect(state.entitlement).toEqual(ENTITLEMENT);
			expect(state.error).toBeNull();
		});

		it("keeps an unbounded tier's null allowances rather than coercing them", () => {
			const unlimited: EntitlementResponseDto = {
				...ENTITLEMENT,
				limits: { completed: null, started: null },
				remaining: { completed: null, started: null },
				tier: TierKey.UNLIMITED,
			};
			const action = { payload: unlimited, type: getEntitlement.fulfilled.type };
			const state = reducer(initialState, action);

			expect(state.entitlement?.remaining.started).toBeNull();
			expect(state.entitlement?.limits.completed).toBeNull();
		});

		it("keeps the last good snapshot when a refresh fails", () => {
			const loaded = reducer(initialState, {
				payload: ENTITLEMENT,
				type: getEntitlement.fulfilled.type,
			});
			const action = {
				payload: { message: "Network error" } as ThunkErrorPayload,
				type: getEntitlement.rejected.type,
			};
			const state = reducer(loaded, action);

			expect(state.dataStatus).toBe(DataStatus.REJECTED);
			expect(state.entitlement).toEqual(ENTITLEMENT);
			expect(state.error).toEqual({ message: "Network error" });
		});

		it("falls back to the thrown error message when the rejection carries no payload", () => {
			const action = {
				error: { message: "Request failed" },
				type: getEntitlement.rejected.type,
			};
			const state = reducer(initialState, action);

			expect(state.error).toEqual({ message: "Request failed" });
		});
	});

	describe("getEntitlement thunk", () => {
		it("calls entitlementApi.getEntitlement on success", async () => {
			const entitlementApiMock = {
				getEntitlement: vi.fn().mockResolvedValue(ENTITLEMENT),
			};
			const extra = { entitlementApi: entitlementApiMock } as unknown as ThunkExtra;

			const result = await getEntitlement()(mockDispatch, mockGetState, extra);

			expect(entitlementApiMock.getEntitlement).toHaveBeenCalled();
			expect(result.payload).toEqual(ENTITLEMENT);
		});

		it("returns rejected value on api error", async () => {
			const errorMessage = "API error";
			const entitlementApiMock = {
				getEntitlement: vi.fn().mockRejectedValue(new Error(errorMessage)),
			};
			const extra = { entitlementApi: entitlementApiMock } as unknown as ThunkExtra;

			const result = await getEntitlement()(mockDispatch, mockGetState, extra);

			expect(result.meta.requestStatus).toBe("rejected");
			expect((result.payload as ThunkErrorPayload).message).toBe(errorMessage);
		});
	});
});
