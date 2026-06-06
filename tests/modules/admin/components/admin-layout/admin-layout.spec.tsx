// @vitest-environment jsdom
import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";

import { DataStatus } from "~/libs/enums/enums";
import { AdminLayout } from "~/modules/admin/components/admin-layout/admin-layout";
import { reducer as authReducer } from "~/modules/auth/slices/auth.slice";

const createMockStore = (): ReturnType<typeof configureStore> => {
	return configureStore({
		preloadedState: {
			auth: {
				dataStatus: DataStatus.IDLE,
				error: null,
				isAuthenticated: true,
				user: { email: "a@a.com", id: 1, is_admin: true, name: "Admin" },
			},
		},
		reducer: {
			auth: authReducer,
		},
	});
};

describe("AdminLayout", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders the outlet content for a child route", () => {
		const store = createMockStore();

		render(
			<Provider store={store}>
				<MemoryRouter initialEntries={["/admin"]}>
					<Routes>
						<Route element={<AdminLayout />} path="/admin">
							<Route element={<div>Admin Inner</div>} index />
						</Route>
					</Routes>
				</MemoryRouter>
			</Provider>
		);

		expect(screen.getByText("Admin Inner")).toBeInTheDocument();
	});

	it("renders a logout control in the header", () => {
		const store = createMockStore();

		render(
			<Provider store={store}>
				<MemoryRouter initialEntries={["/admin"]}>
					<Routes>
						<Route element={<AdminLayout />} path="/admin">
							<Route element={<div />} index />
						</Route>
					</Routes>
				</MemoryRouter>
			</Provider>
		);

		const buttons = screen.getAllByRole("button");

		expect(buttons.length).toBeGreaterThan(0);
	});
});
