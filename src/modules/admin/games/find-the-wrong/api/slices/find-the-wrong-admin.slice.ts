import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums";
import { type ThunkErrorPayload, type ValueOf } from "~/libs/types/types";

import { type FindTheWrongAdminLevelDto } from "../../libs/types/types";
import { createLevel, deleteLevel, getLevelsList } from "./find-the-wrong-admin-actions";

type State = {
	currentLevel: FindTheWrongAdminLevelDto | null;
	error: null | ThunkErrorPayload;
	levelsList: FindTheWrongAdminLevelDto[];
	listStatus: ValueOf<typeof DataStatus>;
	loadStatus: ValueOf<typeof DataStatus>;
};

const initialState: State = {
	currentLevel: null,
	error: null,
	levelsList: [],
	listStatus: DataStatus.IDLE,
	loadStatus: DataStatus.IDLE,
};

const { actions, name, reducer } = createSlice({
	extraReducers(builder) {
		builder.addCase(getLevelsList.pending, (state) => {
			state.listStatus = DataStatus.PENDING;
			state.error = null;
		});
		builder.addCase(getLevelsList.fulfilled, (state, action) => {
			state.listStatus = DataStatus.FULFILLED;
			state.levelsList = action.payload;
			state.error = null;
		});
		builder.addCase(getLevelsList.rejected, (state, action) => {
			if (action.meta.aborted) {
				return;
			}

			state.listStatus = DataStatus.REJECTED;
			state.error =
				action.payload ?? (action.error.message ? { message: action.error.message } : null);
		});

		builder.addCase(createLevel.fulfilled, (state, action) => {
			state.levelsList = [action.payload, ...state.levelsList];
		});

		builder.addCase(deleteLevel.fulfilled, (state, action) => {
			state.levelsList = state.levelsList.filter((level) => level.id !== action.payload);
		});
	},
	initialState,
	name: "find-the-wrong-admin",
	reducers: {
		clearCurrentLevel: (state) => {
			state.currentLevel = null;
			state.loadStatus = DataStatus.IDLE;
			state.error = null;
		},
		clearLevelsList: (state) => {
			state.levelsList = [];
			state.listStatus = DataStatus.IDLE;
			state.error = null;
		},
	},
});

export { actions, name, reducer };
