import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { type User } from "../libs/types/types";
import { register } from "./actions";

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
			state.error = action.payload?.message ?? action.error.message ?? "Registration failed";
		});
	},
	initialState,
	name: "auth",
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
		logout: (state) => {
			state.isAuthenticated = false;
			state.user = null;
			state.error = null;
			state.dataStatus = DataStatus.IDLE;
			// Token removal should be done via storage.drop(StorageKey.TOKEN) in component
		},
	},
});

export { actions, name, reducer };
export {register} from "./actions";