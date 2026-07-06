import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums";
import { toThunkError } from "~/libs/helpers/helpers";
import { type ThunkErrorPayload, type ValueOf } from "~/libs/types/types";

import { type ArithmeticLevelDto } from "../../libs/types/arithmetic-level-dto.type";
import { getLevelById } from "./arithmetic-game-actions";

type State = {
	currentLevel: ArithmeticLevelDto | null;
	currentStatus: ValueOf<typeof DataStatus>;
	error: null | ThunkErrorPayload;
};

const initialState: State = {
	currentLevel: null,
	currentStatus: DataStatus.IDLE,
	error: null,
};

const { actions, name, reducer } = createSlice({
	extraReducers(builder) {
		builder.addCase(getLevelById.pending, (state) => {
			state.currentStatus = DataStatus.PENDING;
			state.error = null;
		});
		builder.addCase(getLevelById.fulfilled, (state, action) => {
			state.currentStatus = DataStatus.FULFILLED;
			state.currentLevel = action.payload;
			state.error = null;
		});
		builder.addCase(getLevelById.rejected, (state, action) => {
			state.currentStatus = DataStatus.REJECTED;
			state.error = toThunkError(action);
		});
	},
	initialState,
	name: "arithmetic-game",
	reducers: {
		clearCurrentLevel: (state) => {
			state.currentLevel = null;
			state.currentStatus = DataStatus.IDLE;
			state.error = null;
		},
	},
});

export { actions, name, reducer };
