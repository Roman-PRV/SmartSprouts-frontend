import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums";
import { type Point, type ThunkErrorPayload, type ValueOf } from "~/libs/types/types";

import { type FindTheWrongAdminLevelDto } from "../../libs/types/types";
import {
	createItem,
	createLevel,
	deleteItem,
	deleteLevel,
	getLevel,
	getLevelsList,
	updateItem,
	updateLevel,
} from "./find-the-wrong-admin-actions";

const NEW_ITEM_DELTA = 1;

type State = {
	currentLevel: FindTheWrongAdminLevelDto | null;
	levelError: null | ThunkErrorPayload;
	levelsList: FindTheWrongAdminLevelDto[];
	listError: null | ThunkErrorPayload;
	listStatus: ValueOf<typeof DataStatus>;
	loadStatus: ValueOf<typeof DataStatus>;
};

const initialState: State = {
	currentLevel: null,
	levelError: null,
	levelsList: [],
	listError: null,
	listStatus: DataStatus.IDLE,
	loadStatus: DataStatus.IDLE,
};

const { actions, name, reducer } = createSlice({
	extraReducers(builder) {
		builder.addCase(getLevelsList.pending, (state) => {
			state.listStatus = DataStatus.PENDING;
			state.listError = null;
		});
		builder.addCase(getLevelsList.fulfilled, (state, action) => {
			state.listStatus = DataStatus.FULFILLED;
			state.levelsList = action.payload;
			state.listError = null;
		});
		builder.addCase(getLevelsList.rejected, (state, action) => {
			if (action.meta.aborted) {
				return;
			}

			state.listStatus = DataStatus.REJECTED;
			state.listError =
				action.payload ?? (action.error.message ? { message: action.error.message } : null);
		});

		builder.addCase(createLevel.fulfilled, (state, action) => {
			state.levelsList = [action.payload, ...state.levelsList];
		});

		builder.addCase(deleteLevel.fulfilled, (state, action) => {
			state.levelsList = state.levelsList.filter((level) => level.id !== action.payload);
		});

		builder.addCase(getLevel.pending, (state) => {
			state.loadStatus = DataStatus.PENDING;
			state.levelError = null;
		});
		builder.addCase(getLevel.fulfilled, (state, action) => {
			state.loadStatus = DataStatus.FULFILLED;
			state.currentLevel = action.payload;
			state.levelError = null;
		});
		builder.addCase(getLevel.rejected, (state, action) => {
			if (action.meta.aborted) {
				return;
			}

			state.loadStatus = DataStatus.REJECTED;
			state.levelError =
				action.payload ?? (action.error.message ? { message: action.error.message } : null);
		});

		builder.addCase(updateLevel.fulfilled, (state, action) => {
			if (action.payload.items !== undefined) {
				state.currentLevel = action.payload;

				return;
			}

			const previousItems = state.currentLevel?.items;

			state.currentLevel = previousItems
				? { ...action.payload, items: previousItems }
				: action.payload;
		});

		builder.addCase(createItem.fulfilled, (state, action) => {
			if (!state.currentLevel) {
				return;
			}

			const existing = state.currentLevel.items ?? [];

			state.currentLevel.items = [...existing, action.payload];
			state.currentLevel.items_count = existing.length + NEW_ITEM_DELTA;
		});

		builder.addCase(updateItem.fulfilled, (state, action) => {
			if (!state.currentLevel?.items) {
				return;
			}

			state.currentLevel.items = state.currentLevel.items.map((item) =>
				item.id === action.payload.id ? action.payload : item
			);
		});

		builder.addCase(deleteItem.fulfilled, (state, action) => {
			if (!state.currentLevel?.items) {
				return;
			}

			state.currentLevel.items = state.currentLevel.items.filter(
				(item) => item.id !== action.payload
			);
			state.currentLevel.items_count = state.currentLevel.items.length;
		});
	},
	initialState,
	name: "find-the-wrong-admin",
	reducers: {
		clearCurrentLevel: (state) => {
			state.currentLevel = null;
			state.loadStatus = DataStatus.IDLE;
			state.levelError = null;
		},
		clearLevelsList: (state) => {
			state.levelsList = [];
			state.listStatus = DataStatus.IDLE;
			state.listError = null;
		},
		/**
		 * Optimistic in-place polygon update used during editor drag/insert/delete.
		 *
		 * Consumers MUST dispatch this *before* scheduling debounced autosave so
		 * subsequent edits read the latest geometry from the store instead of
		 * the lagging pre-autosave snapshot (otherwise rapid edits cancel each
		 * other inside the debounce window — see WIW-FE-04 race fix).
		 *
		 * Edit-session boundary (drag start, vertex insert, vertex delete) is
		 * where future Undo (FE-06) will snapshot history; this reducer is the
		 * downstream mutation, not the boundary itself.
		 */
		setItemPolygon: (state, action: PayloadAction<{ itemId: number; polygon: Point[] }>) => {
			if (!state.currentLevel?.items) {
				return;
			}

			state.currentLevel.items = state.currentLevel.items.map((item) =>
				item.id === action.payload.itemId ? { ...item, polygon: action.payload.polygon } : item
			);
		},
	},
});

export { actions, name, reducer };
