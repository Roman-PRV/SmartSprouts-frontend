import { describe, expect, it } from "vitest";

import { DataStatus } from "~/libs/enums/enums";
import {
	createLevel,
	deleteLevel,
	getLevelsList,
} from "~/modules/admin/games/find-the-wrong/api/slices/find-the-wrong-admin-actions";
import {
	actions,
	reducer,
} from "~/modules/admin/games/find-the-wrong/api/slices/find-the-wrong-admin.slice";
import { type FindTheWrongAdminLevelDto } from "~/modules/admin/games/find-the-wrong/libs/types/types";

const sampleLevel = (id: number): FindTheWrongAdminLevelDto => ({
	id,
	image_url: null,
	items_count: 0,
	title: { en: `EN-${String(id)}`, es: `ES-${String(id)}`, uk: `UK-${String(id)}` },
});

const initialState = {
	currentLevel: null,
	error: null,
	levelsList: [],
	listStatus: DataStatus.IDLE,
	loadStatus: DataStatus.IDLE,
};

describe("find-the-wrong-admin slice", () => {
	it("returns the initial state", () => {
		expect(reducer(undefined, { type: "@UNKNOWN" })).toEqual(initialState);
	});

	describe("clearLevelsList", () => {
		it("resets levelsList and listStatus", () => {
			const seeded = {
				...initialState,
				error: { message: "oops" },
				levelsList: [sampleLevel(1)],
				listStatus: DataStatus.FULFILLED,
			};

			const state = reducer(seeded, actions.clearLevelsList());

			expect(state.levelsList).toEqual([]);
			expect(state.listStatus).toBe(DataStatus.IDLE);
			expect(state.error).toBeNull();
		});
	});

	describe("clearCurrentLevel", () => {
		it("resets currentLevel and loadStatus", () => {
			const seeded = {
				...initialState,
				currentLevel: sampleLevel(2),
				loadStatus: DataStatus.FULFILLED,
			};

			const state = reducer(seeded, actions.clearCurrentLevel());

			expect(state.currentLevel).toBeNull();
			expect(state.loadStatus).toBe(DataStatus.IDLE);
		});
	});

	describe("getLevelsList", () => {
		it("sets PENDING on pending", () => {
			const state = reducer(initialState, { type: getLevelsList.pending.type });

			expect(state.listStatus).toBe(DataStatus.PENDING);
			expect(state.error).toBeNull();
		});

		it("populates levelsList on fulfilled", () => {
			const payload = [sampleLevel(1), sampleLevel(2)];
			const state = reducer(initialState, { payload, type: getLevelsList.fulfilled.type });

			expect(state.listStatus).toBe(DataStatus.FULFILLED);
			expect(state.levelsList).toEqual(payload);
		});

		it("captures error payload on rejected", () => {
			const payload = { message: "Failed", status: 500 };
			const state = reducer(initialState, {
				meta: { aborted: false },
				payload,
				type: getLevelsList.rejected.type,
			});

			expect(state.listStatus).toBe(DataStatus.REJECTED);
			expect(state.error).toEqual(payload);
		});

		it("ignores rejection caused by promise.abort() (StrictMode re-mount)", () => {
			const seeded = { ...initialState, listStatus: DataStatus.PENDING };
			const state = reducer(seeded, {
				meta: { aborted: true },
				type: getLevelsList.rejected.type,
			});

			expect(state.listStatus).toBe(DataStatus.PENDING);
			expect(state.error).toBeNull();
		});
	});

	describe("createLevel", () => {
		it("prepends new level on fulfilled", () => {
			const existing = sampleLevel(1);
			const newLevel = sampleLevel(2);
			const seeded = { ...initialState, levelsList: [existing] };

			const state = reducer(seeded, { payload: newLevel, type: createLevel.fulfilled.type });

			expect(state.levelsList).toEqual([newLevel, existing]);
		});

		it("does not touch list-scoped error on rejected (toast handles UX)", () => {
			const seeded = { ...initialState, error: { message: "pre-existing list error" } };
			const payload = { message: "validation failed" };
			const state = reducer(seeded, { payload, type: createLevel.rejected.type });

			expect(state.error).toEqual({ message: "pre-existing list error" });
		});
	});

	describe("deleteLevel", () => {
		it("removes matching level on fulfilled", () => {
			const seeded = {
				...initialState,
				levelsList: [sampleLevel(1), sampleLevel(2), sampleLevel(3)],
			};

			const state = reducer(seeded, { payload: 2, type: deleteLevel.fulfilled.type });

			expect(state.levelsList.map((level) => level.id)).toEqual([1, 3]);
		});

		it("does not touch list-scoped error on rejected (toast handles UX)", () => {
			const seeded = { ...initialState, error: { message: "pre-existing list error" } };
			const payload = { message: "not found" };
			const state = reducer(seeded, { payload, type: deleteLevel.rejected.type });

			expect(state.error).toEqual({ message: "pre-existing list error" });
		});
	});
});
