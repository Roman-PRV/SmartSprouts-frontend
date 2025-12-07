import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { type TrueFalseGameLevelDto } from "../../libs/types/true-false-game-level-dto.type";
import { getLevelById } from "./true-false-game-actions";

type State = {
	currentLevel: null | TrueFalseGameLevelDto;
	currentStatus: ValueOf<typeof DataStatus>;
};

const initialState: State = {
	currentLevel: null,
	currentStatus: DataStatus.IDLE,
};

const { actions, name, reducer } = createSlice({
	extraReducers(builder) {
		builder.addCase(getLevelById.pending, (state) => {
			state.currentStatus = DataStatus.PENDING;
		});
		builder.addCase(getLevelById.fulfilled, (state, action) => {
			state.currentStatus = DataStatus.FULFILLED;
			state.currentLevel = action.payload;
		});
		builder.addCase(getLevelById.rejected, (state) => {
			state.currentStatus = DataStatus.REJECTED;
		});
	},
	initialState,
	name: "true-false-game",
	reducers: {
		clearCurrentLevel: (state) => {
			state.currentLevel = null;
			state.currentStatus = DataStatus.IDLE;
		},
	},
});

export { actions, name, reducer };
