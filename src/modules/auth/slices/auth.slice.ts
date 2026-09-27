import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums";
import { type ThunkErrorPayload, type ValueOf } from "~/libs/types/types";

import { type User } from "../libs/types/types";
import {
	acceptConsents,
	declineConsents,
	getAuthenticatedUser,
	login,
	loginWithGoogle,
	logout,
	register,
} from "./actions";

type State = {
	/** Whether the user has accepted the current legal-document versions. */
	consentCurrent: boolean;
	/** Refused the current versions, as opposed to never having answered them. */
	consentDeclined: boolean;
	dataStatus: ValueOf<typeof DataStatus>;
	error: null | ThunkErrorPayload;
	isAuthenticated: boolean;
	user: null | User;
};

const initialState: State = {
	consentCurrent: true,
	consentDeclined: false,
	dataStatus: DataStatus.IDLE,
	error: null,
	isAuthenticated: false,
	user: null,
};

const { actions, reducer } = createSlice({
	extraReducers: (builder) => {
		// Local flip instead of a me-refetch: the acceptance of the current
		// versions was just recorded server-side, and a failed refetch here
		// would falsely log the user out.
		builder.addCase(acceptConsents.fulfilled, (state) => {
			state.consentCurrent = true;
			state.consentDeclined = false;
		});

		builder.addCase(declineConsents.fulfilled, (state, action) => {
			state.consentCurrent = action.payload.consent_current;
			state.consentDeclined = action.payload.consent_declined;
		});

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
			state.user = action.payload.user;
			state.consentCurrent = action.payload.consent_current;
			state.consentDeclined = action.payload.consent_declined;
			state.error = null;
		});
		builder.addCase(getAuthenticatedUser.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
			state.isAuthenticated = false;
			state.user = null;
			state.consentCurrent = true;
			state.consentDeclined = false;
			state.error = null;
		});

		builder.addCase(login.fulfilled, (state, action) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.isAuthenticated = true;
			state.user = action.payload.user;
			state.consentCurrent = action.payload.consent_current;
			state.consentDeclined = action.payload.consent_declined;
			state.error = null;
			// Token is stored in async thunk via storage.set()
		});
		builder.addCase(login.rejected, (state, action) => {
			state.dataStatus = DataStatus.REJECTED;
			state.isAuthenticated = false;
			state.user = null;
			state.error = action.payload ?? {
				message: action.error.message ?? "Login failed",
			};
		});

		builder.addCase(logout.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
			state.error = null;
		});
		builder.addCase(logout.fulfilled, (state) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.isAuthenticated = false;
			state.user = null;
			state.consentCurrent = true;
			state.consentDeclined = false;
			state.error = null;
		});
		builder.addCase(logout.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
			state.isAuthenticated = false;
			state.user = null;
			state.consentCurrent = true;
			state.consentDeclined = false;
			state.error = null;
		});

		builder.addCase(loginWithGoogle.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
			state.error = null;
		});
		builder.addCase(loginWithGoogle.fulfilled, (state, action) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.isAuthenticated = true;
			state.user = action.payload.user;
			state.consentCurrent = action.payload.consent_current;
			state.consentDeclined = action.payload.consent_declined;
			state.error = null;
		});
		builder.addCase(loginWithGoogle.rejected, (state, action) => {
			state.dataStatus = DataStatus.REJECTED;
			state.isAuthenticated = false;
			state.user = null;
			state.error = action.payload ?? {
				message: action.error.message ?? "Google sign-in failed",
			};
		});

		builder.addCase(register.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
			state.error = null;
		});
		builder.addCase(register.fulfilled, (state, action) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.isAuthenticated = true;
			state.user = action.payload.user;
			state.consentCurrent = action.payload.consent_current;
			state.consentDeclined = action.payload.consent_declined;
			state.error = null;
			// Token is stored in async thunk via storage.set()
		});
		builder.addCase(register.rejected, (state, action) => {
			state.dataStatus = DataStatus.REJECTED;
			state.isAuthenticated = false;
			state.user = null;
			state.error = action.payload ?? {
				message: action.error.message ?? "Registration failed",
			};
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

export { actions, reducer };
