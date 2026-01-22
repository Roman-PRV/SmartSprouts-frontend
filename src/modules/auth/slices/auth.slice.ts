import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums";
import { type ValueOf } from "~/libs/types/types";

import { type User } from "../libs/types/types";
import { getAuthenticatedUser, login, logout, register } from "./actions";

type State = {
	dataStatus: ValueOf<typeof DataStatus>;
	error: null | string;
	isAuthenticated: boolean;
	user: null | User;
};

const initialState: State = {
	dataStatus: DataStatus.IDLE,
	error: null,
	isAuthenticated: false,
	user: null,
};

const { actions, name, reducer } = createSlice({
	extraReducers: (builder) => {
		builder.addCase(login.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
			state.error = null;
		});
		builder.addCase(getAuthenticatedUser.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
			state.error = null;
		});
		builder.addCase(getAuthenticatedUser.fulfilled, (state, action) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.isAuthenticated = true;
			state.user = action.payload;
			state.error = null;
		});
		builder.addCase(getAuthenticatedUser.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
			state.isAuthenticated = false;
			state.user = null;
			state.error = null;
		});

		builder.addCase(login.fulfilled, (state, action) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.isAuthenticated = true;
			state.user = action.payload.user;
			state.error = null;
			// Token is stored in async thunk via storage.set()
		});
		builder.addCase(login.rejected, (state, action) => {
			state.dataStatus = DataStatus.REJECTED;
			state.isAuthenticated = false;
			state.user = null;
			state.error = action.payload?.message ?? action.error.message ?? "Login failed";
		});

		builder.addCase(logout.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
			state.error = null;
		});
		builder.addCase(logout.fulfilled, (state) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.isAuthenticated = false;
			state.user = null;
			state.error = null;
		});
		builder.addCase(logout.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
			state.isAuthenticated = false;
			state.user = null;
			state.error = null;
		});

		builder.addCase(register.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
			state.error = null;
		});
		builder.addCase(register.fulfilled, (state, action) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.isAuthenticated = true;
			state.user = action.payload.user;
			state.error = null;
			// Token is stored in async thunk via storage.set()
		});
		builder.addCase(register.rejected, (state, action) => {
			state.dataStatus = DataStatus.REJECTED;
			state.isAuthenticated = false;
			state.user = null;
			state.error = action.payload?.message ?? action.error.message ?? "Registration failed";
		});
	},
	initialState,
	name: "auth",
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
	},
});

export { actions, name, reducer };
export { getAuthenticatedUser, login, logout, register } from "./actions";
