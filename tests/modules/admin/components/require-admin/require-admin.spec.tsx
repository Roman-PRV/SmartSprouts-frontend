// @vitest-environment jsdom
import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";

import { DataStatus } from "~/libs/enums/enums";
import { RequireAdmin } from "~/modules/admin/components/require-admin/require-admin";
import { reducer as authReducer } from "~/modules/auth/slices/auth.slice";

type AuthState = {
	consentCurrent: boolean;
	dataStatus: (typeof DataStatus)[keyof typeof DataStatus];
	error: null | { message: string };
	isAuthenticated: boolean;
	user: MockUser | null;
};

type MockUser = { email: string; has_password: boolean; id: number; is_admin: boolean; name: string };

const ADMIN_USER: MockUser = { email: "a@a.com", has_password: true, id: 1, is_admin: true, name: "Admin" };
const REGULAR_USER: MockUser = { email: "u@u.com", has_password: true, id: 2, is_admin: false, name: "User" };

const createMockStore = (
	initialAuthState?: Partial<AuthState>
): ReturnType<typeof configureStore> => {
	return configureStore({
		preloadedState: {
			auth: {
				consentCurrent: true,
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
	initialAuthState?: Partial<AuthState>,
	initialEntries = ["/admin"]
): ReturnType<typeof render> => {
	const store = createMockStore(initialAuthState);

	return render(
		<Provider store={store}>
			<MemoryRouter initialEntries={initialEntries}>
				<Routes>
					<Route element={<RequireAdmin />}>
						<Route element={<div>Admin Content</div>} path="/admin" />
					</Route>
					<Route element={<div>Home Page</div>} path="/" />
				</Routes>
			</MemoryRouter>
		</Provider>
	);
};

describe("RequireAdmin", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders Outlet when user is admin", () => {
		renderWithProvider({ isAuthenticated: true, user: ADMIN_USER });

		expect(screen.getByText("Admin Content")).toBeInTheDocument();
		expect(screen.queryByText("Home Page")).not.toBeInTheDocument();
	});

	it("redirects to / when user is authenticated but not admin", () => {
		renderWithProvider({ isAuthenticated: true, user: REGULAR_USER });

		expect(screen.getByText("Home Page")).toBeInTheDocument();
		expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
	});

	it("redirects to / when there is no user at all", () => {
		renderWithProvider({ isAuthenticated: false, user: null });

		expect(screen.getByText("Home Page")).toBeInTheDocument();
		expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
	});
});
