// @vitest-environment jsdom
import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import type * as authModule from "~/modules/auth/auth";

import { DataStatus } from "~/libs/enums/enums";
import { i18n } from "~/libs/modules/localization/i18n";
import { AdminLayout } from "~/modules/admin/components/admin-layout/admin-layout";
import { reducer as authReducer } from "~/modules/auth/slices/auth.slice";
import { reducer as gamesReducer } from "~/modules/games/games";

const mockLogout = vi.fn();

vi.mock("~/modules/auth/auth", async (importOriginal) => {
	const actual = await importOriginal<typeof authModule>();

	return {
		...actual,
		useLogout: (): { logout: typeof mockLogout } => ({ logout: mockLogout }),
	};
});

const renderAdminLayout = (): ReturnType<typeof render> => {
	const store = configureStore({
		preloadedState: {
			auth: {
				dataStatus: DataStatus.IDLE,
				error: null,
				isAuthenticated: true,
				user: { email: "a@a.com", has_password: true, id: 1, is_admin: true, name: "Admin" },
			},
			games: {
				currentGame: null,
				currentGameLevels: null,
				currentGameStatus: DataStatus.IDLE,
				currentLevelsGameId: null,
				games: [],
				gamesStatus: DataStatus.FULFILLED,
				levelsStatus: DataStatus.IDLE,
			},
		},
		reducer: {
			auth: authReducer,
			games: gamesReducer,
		},
	});

	return render(
		<Provider store={store}>
			<MemoryRouter initialEntries={["/admin"]}>
				<Routes>
					<Route element={<div>App Home</div>} path="/" />
					<Route element={<AdminLayout />} path="/admin">
						<Route element={<div>Admin Inner</div>} index />
					</Route>
				</Routes>
			</MemoryRouter>
		</Provider>
	);
};

describe("AdminLayout", () => {
	beforeEach(() => {
		mockLogout.mockClear();
	});

	afterEach(() => {
		cleanup();
	});

	it("renders the outlet content for a child route", () => {
		renderAdminLayout();

		expect(screen.getByText("Admin Inner")).toBeInTheDocument();
	});

	it("invokes logout when the header logout button is clicked", async () => {
		renderAdminLayout();

		const logoutButton = screen.getByRole("button", {
			name: i18n.t("common.navigation.logout"),
		});

		await userEvent.click(logoutButton);

		expect(mockLogout).toHaveBeenCalledTimes(1);
	});

	it("navigates to the app root without logging out when exit is clicked", async () => {
		renderAdminLayout();

		const exitLink = screen.getByRole("link", {
			name: i18n.t("admin.header.exitToApp"),
		});

		await userEvent.click(exitLink);

		expect(screen.getByText("App Home")).toBeInTheDocument();
		expect(mockLogout).not.toHaveBeenCalled();
	});
});
