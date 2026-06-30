import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums";
import { type ThunkErrorPayload, type ValueOf } from "~/libs/types/types";

import { type TrueFalseAdminLevelDto } from "../../libs/types/types";
import {
	createLevel,
	createStatement,
	deleteLevel,
	deleteStatement,
	getLevel,
	getLevelsList,
	updateLevel,
	updateStatement,
} from "./true-false-admin-actions";

const NEW_STATEMENT_DELTA = 1;

type State = {
	currentLevel: null | TrueFalseAdminLevelDto;
	levelError: null | ThunkErrorPayload;
	levelsList: TrueFalseAdminLevelDto[];
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
			// The per-game level resource the backend returns already embeds the
			// statements, so the whole current level can be replaced safely.
			state.currentLevel = action.payload;
		});

		builder.addCase(createStatement.fulfilled, (state, action) => {
			if (!state.currentLevel) {
				return;
			}

			const existing = state.currentLevel.statements ?? [];

			state.currentLevel.statements = [...existing, action.payload];
			state.currentLevel.statements_count = existing.length + NEW_STATEMENT_DELTA;
		});

		builder.addCase(updateStatement.fulfilled, (state, action) => {
			if (!state.currentLevel?.statements) {
				return;
			}

			state.currentLevel.statements = state.currentLevel.statements.map((statement) =>
				statement.id === action.payload.id ? action.payload : statement
			);
		});

		builder.addCase(deleteStatement.fulfilled, (state, action) => {
			if (!state.currentLevel?.statements) {
				return;
			}

			state.currentLevel.statements = state.currentLevel.statements.filter(
				(statement) => statement.id !== action.payload
			);
			state.currentLevel.statements_count = state.currentLevel.statements.length;
		});
	},
	initialState,
	name: "true-false-admin",
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
	},
});

export { actions, name, reducer };
