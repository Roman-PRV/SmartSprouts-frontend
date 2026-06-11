import { describe, expect, it } from "vitest";

import { DataStatus } from "~/libs/enums/enums";
import {
	createItem,
	createLevel,
	deleteItem,
	deleteLevel,
	getLevel,
	getLevelsList,
	updateItem,
	updateLevel,
} from "~/modules/admin/games/find-the-wrong/api/slices/find-the-wrong-admin-actions";
import {
	actions,
	reducer,
} from "~/modules/admin/games/find-the-wrong/api/slices/find-the-wrong-admin.slice";
import {
	type FindTheWrongAdminItemDto,
	type FindTheWrongAdminLevelDto,
} from "~/modules/admin/games/find-the-wrong/libs/types/types";

const sampleLevel = (id: number): FindTheWrongAdminLevelDto => ({
	id,
	image_url: null,
	items_count: 0,
	title: { en: `EN-${String(id)}`, es: `ES-${String(id)}`, uk: `UK-${String(id)}` },
});

const sampleItem = (id: number): FindTheWrongAdminItemDto => ({
	id,
	name: { en: `N-${String(id)}`, es: `N-${String(id)}`, uk: `N-${String(id)}` },
	polygon: [
		[0, 0],
		[1, 0],
		[0.5, 1],
	],
});

const initialState = {
	currentLevel: null,
	levelError: null,
	levelsList: [],
	listError: null,
	listStatus: DataStatus.IDLE,
	loadStatus: DataStatus.IDLE,
};

describe("find-the-wrong-admin slice", () => {
	it("returns the initial state", () => {
		expect(reducer(undefined, { type: "@UNKNOWN" })).toEqual(initialState);
	});

	describe("clearLevelsList", () => {
		it("resets levelsList, listStatus and listError", () => {
			const seeded = {
				...initialState,
				levelsList: [sampleLevel(1)],
				listError: { message: "oops" },
				listStatus: DataStatus.FULFILLED,
			};

			const state = reducer(seeded, actions.clearLevelsList());

			expect(state.levelsList).toEqual([]);
			expect(state.listStatus).toBe(DataStatus.IDLE);
			expect(state.listError).toBeNull();
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

	describe("setItemPolygon", () => {
		it("replaces matching item polygon optimistically", () => {
			const item1 = sampleItem(1);
			const item2 = sampleItem(2);
			const seeded = {
				...initialState,
				currentLevel: { ...sampleLevel(5), items: [item1, item2], items_count: 2 },
			};
			const nextPolygon: [number, number][] = [
				[0.1, 0.1],
				[0.9, 0.1],
				[0.5, 0.9],
			];

			const state = reducer(
				seeded,
				actions.setItemPolygon({ itemId: 1, polygon: nextPolygon })
			);

			expect(state.currentLevel?.items?.[0]?.polygon).toEqual(nextPolygon);
			expect(state.currentLevel?.items?.[1]?.polygon).toEqual(item2.polygon);
		});

		it("no-ops when currentLevel has no items", () => {
			const state = reducer(
				initialState,
				actions.setItemPolygon({ itemId: 1, polygon: [[0, 0], [1, 0], [0.5, 1]] })
			);

			expect(state.currentLevel).toBeNull();
		});

		it("merges sequential edits to different items without losing earlier change", () => {
			const item1 = sampleItem(1);
			const item2 = sampleItem(2);
			const seeded = {
				...initialState,
				currentLevel: { ...sampleLevel(5), items: [item1, item2], items_count: 2 },
			};
			const polygonA: [number, number][] = [
				[0.2, 0.2],
				[0.8, 0.2],
				[0.5, 0.8],
			];
			const polygonB: [number, number][] = [
				[0.3, 0.3],
				[0.7, 0.3],
				[0.5, 0.7],
			];

			const afterA = reducer(
				seeded,
				actions.setItemPolygon({ itemId: 1, polygon: polygonA })
			);
			const afterB = reducer(
				afterA,
				actions.setItemPolygon({ itemId: 2, polygon: polygonB })
			);

			expect(afterB.currentLevel?.items?.[0]?.polygon).toEqual(polygonA);
			expect(afterB.currentLevel?.items?.[1]?.polygon).toEqual(polygonB);
		});
	});

	describe("getLevelsList", () => {
		it("sets PENDING on pending and clears listError", () => {
			const seeded = { ...initialState, listError: { message: "stale" } };
			const state = reducer(seeded, { type: getLevelsList.pending.type });

			expect(state.listStatus).toBe(DataStatus.PENDING);
			expect(state.listError).toBeNull();
		});

		it("populates levelsList on fulfilled", () => {
			const payload = [sampleLevel(1), sampleLevel(2)];
			const state = reducer(initialState, { payload, type: getLevelsList.fulfilled.type });

			expect(state.listStatus).toBe(DataStatus.FULFILLED);
			expect(state.levelsList).toEqual(payload);
		});

		it("captures listError payload on rejected and leaves levelError untouched", () => {
			const payload = { message: "Failed", status: 500 };
			const seeded = { ...initialState, levelError: { message: "editor-side error" } };
			const state = reducer(seeded, {
				meta: { aborted: false },
				payload,
				type: getLevelsList.rejected.type,
			});

			expect(state.listStatus).toBe(DataStatus.REJECTED);
			expect(state.listError).toEqual(payload);
			expect(state.levelError).toEqual({ message: "editor-side error" });
		});

		it("ignores rejection caused by promise.abort() (StrictMode re-mount)", () => {
			const seeded = { ...initialState, listStatus: DataStatus.PENDING };
			const state = reducer(seeded, {
				meta: { aborted: true },
				type: getLevelsList.rejected.type,
			});

			expect(state.listStatus).toBe(DataStatus.PENDING);
			expect(state.listError).toBeNull();
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

		it("does not touch listError on rejected (toast handles UX)", () => {
			const seeded = { ...initialState, listError: { message: "pre-existing list error" } };
			const payload = { message: "validation failed" };
			const state = reducer(seeded, { payload, type: createLevel.rejected.type });

			expect(state.listError).toEqual({ message: "pre-existing list error" });
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

		it("does not touch listError on rejected (toast handles UX)", () => {
			const seeded = { ...initialState, listError: { message: "pre-existing list error" } };
			const payload = { message: "not found" };
			const state = reducer(seeded, { payload, type: deleteLevel.rejected.type });

			expect(state.listError).toEqual({ message: "pre-existing list error" });
		});
	});

	describe("getLevel", () => {
		it("sets PENDING on pending and clears levelError", () => {
			const seeded = { ...initialState, levelError: { message: "stale" } };
			const state = reducer(seeded, { type: getLevel.pending.type });

			expect(state.loadStatus).toBe(DataStatus.PENDING);
			expect(state.levelError).toBeNull();
		});

		it("stores currentLevel on fulfilled", () => {
			const payload = sampleLevel(7);
			const state = reducer(initialState, { payload, type: getLevel.fulfilled.type });

			expect(state.loadStatus).toBe(DataStatus.FULFILLED);
			expect(state.currentLevel).toEqual(payload);
		});

		it("captures levelError on rejected and leaves listError untouched", () => {
			const payload = { message: "Not found", status: 404 };
			const seeded = { ...initialState, listError: { message: "list-side error" } };
			const state = reducer(seeded, {
				meta: { aborted: false },
				payload,
				type: getLevel.rejected.type,
			});

			expect(state.loadStatus).toBe(DataStatus.REJECTED);
			expect(state.levelError).toEqual(payload);
			expect(state.listError).toEqual({ message: "list-side error" });
		});

		it("ignores rejection caused by promise.abort()", () => {
			const seeded = { ...initialState, loadStatus: DataStatus.PENDING };
			const state = reducer(seeded, {
				meta: { aborted: true },
				type: getLevel.rejected.type,
			});

			expect(state.loadStatus).toBe(DataStatus.PENDING);
			expect(state.levelError).toBeNull();
		});
	});

	describe("updateLevel", () => {
		it("replaces currentLevel on fulfilled", () => {
			const seeded = { ...initialState, currentLevel: sampleLevel(1) };
			const payload = { ...sampleLevel(1), image_url: "/x.png" };
			const state = reducer(seeded, { payload, type: updateLevel.fulfilled.type });

			expect(state.currentLevel).toEqual(payload);
		});

		it("preserves existing items when the response omits them, keeps server items_count", () => {
			const item1 = sampleItem(1);
			const item2 = sampleItem(2);
			const seeded = {
				...initialState,
				currentLevel: { ...sampleLevel(1), items: [item1, item2], items_count: 2 },
			};
			const payload = { ...sampleLevel(1), image_url: "/updated.png", items_count: 2 };
			const state = reducer(seeded, { payload, type: updateLevel.fulfilled.type });

			expect(state.currentLevel?.items).toEqual([item1, item2]);
			expect(state.currentLevel?.items_count).toBe(2);
			expect(state.currentLevel?.image_url).toBe("/updated.png");
		});

		it("trusts server payload fully when items are present", () => {
			const localItem = sampleItem(1);
			const serverItem = sampleItem(99);
			const seeded = {
				...initialState,
				currentLevel: { ...sampleLevel(1), items: [localItem], items_count: 1 },
			};
			const payload = {
				...sampleLevel(1),
				image_url: "/updated.png",
				items: [serverItem],
				items_count: 1,
			};
			const state = reducer(seeded, { payload, type: updateLevel.fulfilled.type });

			expect(state.currentLevel?.items).toEqual([serverItem]);
			expect(state.currentLevel?.items_count).toBe(1);
		});
	});

	describe("createItem", () => {
		it("appends item to currentLevel.items and bumps items_count", () => {
			const item1 = sampleItem(1);
			const item2 = sampleItem(2);
			const seeded = {
				...initialState,
				currentLevel: { ...sampleLevel(5), items: [item1], items_count: 1 },
			};

			const state = reducer(seeded, { payload: item2, type: createItem.fulfilled.type });

			expect(state.currentLevel?.items).toEqual([item1, item2]);
			expect(state.currentLevel?.items_count).toBe(2);
		});

		it("no-ops when currentLevel is null", () => {
			const state = reducer(initialState, {
				payload: sampleItem(1),
				type: createItem.fulfilled.type,
			});

			expect(state.currentLevel).toBeNull();
		});
	});

	describe("updateItem", () => {
		it("replaces matching item immutably", () => {
			const item1 = sampleItem(1);
			const item2 = sampleItem(2);
			const updatedItem1 = {
				...item1,
				name: { en: "UPDATED", es: "UPDATED", uk: "UPDATED" },
			};
			const seeded = {
				...initialState,
				currentLevel: { ...sampleLevel(5), items: [item1, item2], items_count: 2 },
			};

			const state = reducer(seeded, {
				payload: updatedItem1,
				type: updateItem.fulfilled.type,
			});

			expect(state.currentLevel?.items?.[0]).toEqual(updatedItem1);
			expect(state.currentLevel?.items?.[1]).toEqual(item2);
		});
	});

	describe("deleteItem", () => {
		it("filters out matching item and decrements items_count", () => {
			const item1 = sampleItem(1);
			const item2 = sampleItem(2);
			const seeded = {
				...initialState,
				currentLevel: { ...sampleLevel(5), items: [item1, item2], items_count: 2 },
			};

			const state = reducer(seeded, { payload: 1, type: deleteItem.fulfilled.type });

			expect(state.currentLevel?.items).toEqual([item2]);
			expect(state.currentLevel?.items_count).toBe(1);
		});
	});
});
