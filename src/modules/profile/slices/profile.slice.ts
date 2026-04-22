import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums";
import { type ValueOf } from "~/libs/types/types";

import { type UserProfileDto } from "../libs/types/types.js";
import { fetchProfile } from "./actions.js";

type State = {
	dataStatus: ValueOf<typeof DataStatus>;
	error: null | string;
	profile: null | UserProfileDto;
};

const initialState: State = {
	dataStatus: DataStatus.IDLE,
	error: null,
	profile: null,
};

const { actions, reducer } = createSlice({
	extraReducers: (builder) => {
		builder.addCase(fetchProfile.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
			state.error = null;
		});
		builder.addCase(fetchProfile.fulfilled, (state, action) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.profile = action.payload;
			state.error = null;
		});
		builder.addCase(fetchProfile.rejected, (state, action) => {
			state.dataStatus = DataStatus.REJECTED;
			state.error = action.payload?.message ?? action.error.message ?? "Profile fetch failed";
		});
	},
	initialState,
	name: "profile",
	reducers: {},
});

export { actions, reducer };
