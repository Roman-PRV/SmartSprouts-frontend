// @vitest-environment jsdom
import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";

import { ProtectedRoute } from "~/libs/components/protected-route/protected-route";
import { DataStatus } from "~/libs/enums/enums";
import { reducer as authReducer } from "~/modules/auth/slices/auth.slice";

type AuthState = {
	dataStatus: (typeof DataStatus)[keyof typeof DataStatus];
	error: null | { message: string };
	isAuthenticated: boolean;
	user: null | { email: string; has_password: boolean; id: number; is_admin: boolean; name: string };
};

const createMockStore = (initialAuthState?: Partial<AuthState>): ReturnType<typeof configureStore> => {
	return configureStore({
		preloadedState: {
			auth: {
				dataStatus: DataStatus.IDLE,
				error: null,
				isAuthenticated: false,
				user: null,
				...initialAuthState,
			},
		},
		reducer: {
			auth: authReducer,
		},
	});
};

const renderWithProvider = (
	ui: React.ReactElement,
	initialAuthState?: Partial<AuthState>,
	initialEntries = ["/protected"]
): ReturnType<typeof render> & { store: ReturnType<typeof createMockStore> } => {
	const store = createMockStore(initialAuthState);

	return {
		...render(
			<Provider store={store}>
				<MemoryRouter initialEntries={initialEntries}>
					<Routes>
						<Route element={<ProtectedRoute />}>
							<Route element={<div>Protected Content</div>} path="/protected" />
						</Route>
						<Route element={<div>Login Page</div>} path="/login" />
					</Routes>
				</MemoryRouter>
			</Provider>
		),
		store,
	};
};

describe("ProtectedRoute", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders Outlet (protected content) when user is authenticated", () => {
		renderWithProvider(<ProtectedRoute />, { isAuthenticated: true });

		expect(screen.getByText("Protected Content")).toBeInTheDocument();
		expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
	});

	it("redirects to /login when user is not authenticated", () => {
		renderWithProvider(<ProtectedRoute />, { isAuthenticated: false });

		expect(screen.getByText("Login Page")).toBeInTheDocument();
		expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
	});
});
