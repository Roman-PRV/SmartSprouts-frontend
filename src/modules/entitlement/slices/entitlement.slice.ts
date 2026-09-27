import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums";

import { type EntitlementState } from "../libs/types/types";
import { getEntitlement } from "./actions";

const initialState: EntitlementState = {
	dataStatus: DataStatus.IDLE,
	entitlement: null,
	error: null,
};

const { reducer } = createSlice({
	extraReducers: (builder) => {
		builder.addCase(getEntitlement.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
			state.error = null;
		});
		builder.addCase(getEntitlement.fulfilled, (state, action) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.entitlement = action.payload;
			state.error = null;
		});
		// The last good snapshot is kept: an allowance indicator showing a
		// slightly stale number reads better than one that empties itself
		// because a refresh failed.
		builder.addCase(getEntitlement.rejected, (state, action) => {
			state.dataStatus = DataStatus.REJECTED;
			state.error = action.payload ?? {
				message: action.error.message ?? "Failed to load entitlement",
			};
		});
	},
	initialState,
	name: "entitlement",
	reducers: {},
});

export { reducer };
