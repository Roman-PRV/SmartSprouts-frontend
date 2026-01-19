/**
 * @vitest-environment jsdom
 */
import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import "@testing-library/jest-dom/vitest";

import { GuestRoute } from "~/libs/components/guest-route/guest-route";
import { DataStatus } from "~/libs/enums/enums";
import { reducer as authReducer } from "~/modules/auth/slices/auth.slice";

type AuthState = {
	dataStatus: (typeof DataStatus)[keyof typeof DataStatus];
	error: null | string;
	isAuthenticated: boolean;
	user: null | { email: string; id: number; name: string };
};

const createMockStore = (initialAuthState?: Partial<AuthState>) => {
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
	initialEntries = ["/guest"]
) => {
	const store = createMockStore(initialAuthState);
	return {
		...render(
			<Provider store={store}>
				<MemoryRouter initialEntries={initialEntries}>
					<Routes>
						<Route element={<GuestRoute />}>
							<Route path="/guest" element={<div>Guest Content</div>} />
						</Route>
						<Route path="/profile" element={<div>Profile Page</div>} />
					</Routes>
				</MemoryRouter>
			</Provider>
		),
		store,
	};
};

describe("GuestRoute", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders Outlet (guest content) when user is not authenticated", () => {
		renderWithProvider(<GuestRoute />, { isAuthenticated: false });

		expect(screen.getByText("Guest Content")).toBeInTheDocument();
		expect(screen.queryByText("Profile Page")).not.toBeInTheDocument();
	});

	it("redirects to /profile when user is authenticated", () => {
		renderWithProvider(<GuestRoute />, { isAuthenticated: true });

		expect(screen.getByText("Profile Page")).toBeInTheDocument();
		expect(screen.queryByText("Guest Content")).not.toBeInTheDocument();
	});
});
