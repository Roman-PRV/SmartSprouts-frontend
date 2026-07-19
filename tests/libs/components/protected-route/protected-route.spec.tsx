// @vitest-environment jsdom
import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import { ProtectedRoute } from "~/libs/components/protected-route/protected-route";
import { DataStatus } from "~/libs/enums/enums";
import { i18n } from "~/libs/modules/localization/localization";
import { type AsyncThunkConfig } from "~/libs/types/types";
import { reducer as authReducer } from "~/modules/auth/slices/auth.slice";

type AuthState = {
	consentCurrent: boolean;
	dataStatus: (typeof DataStatus)[keyof typeof DataStatus];
	error: null | { message: string };
	isAuthenticated: boolean;
	user: null | { email: string; has_password: boolean; id: number; is_admin: boolean; name: string };
};

type GateFlowMocks = {
	acceptConsents: ReturnType<typeof vi.fn>;
};

type ThunkExtra = AsyncThunkConfig["extra"];

const GATE_USER = {
	email: "parent@example.com",
	has_password: true,
	id: 1,
	is_admin: false,
	name: "Parent",
};

/** Renders the gate flow with a mocked API; consent starts not current. */
const renderConsentGateFlow = (
	acceptConsents = vi.fn(() => Promise.resolve())
): GateFlowMocks => {
	const store = configureStore({
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				thunk: {
					extraArgument: {
						profileApi: { acceptConsents },
					} as unknown as ThunkExtra,
				},
			}),
		preloadedState: {
			auth: {
				consentCurrent: false,
				dataStatus: DataStatus.FULFILLED,
				error: null,
				isAuthenticated: true,
				user: GATE_USER,
			},
		},
		reducer: { auth: authReducer },
	});

	render(
		<Provider store={store}>
			<MemoryRouter initialEntries={["/protected"]}>
				<Routes>
					<Route element={<ProtectedRoute />}>
						<Route element={<div>Protected Content</div>} path="/protected" />
					</Route>
				</Routes>
			</MemoryRouter>
		</Provider>
	);

	return { acceptConsents };
};

const createMockStore = (initialAuthState?: Partial<AuthState>): ReturnType<typeof configureStore> => {
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

	describe("consent gate", () => {
		it("never shows the gate when consent is current", () => {
			renderWithProvider(<ProtectedRoute />, {
				consentCurrent: true,
				isAuthenticated: true,
				user: GATE_USER,
			});

			expect(screen.getByText("Protected Content")).toBeInTheDocument();
			expect(screen.queryByText(i18n.t("auth.consentGate.title"))).not.toBeInTheDocument();
		});

		it("blocks the content behind the gate when consent is not current", () => {
			renderWithProvider(<ProtectedRoute />, {
				consentCurrent: false,
				isAuthenticated: true,
				user: GATE_USER,
			});

			expect(screen.getByText(i18n.t("auth.consentGate.title"))).toBeInTheDocument();
			expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
		});

		it("unblocks the content after the consent is accepted", async () => {
			const { acceptConsents } = renderConsentGateFlow();
			const interaction = userEvent.setup();

			await interaction.click(screen.getByRole("checkbox"));
			await interaction.click(
				screen.getByRole("button", { name: i18n.t("auth.consentGate.button") })
			);

			await waitFor(() => {
				expect(screen.getByText("Protected Content")).toBeInTheDocument();
			});
			expect(acceptConsents).toHaveBeenCalledTimes(1);
		});

		it("keeps the gate when the acceptance request fails", async () => {
			const acceptConsents = vi.fn(() => Promise.reject(new Error("network")));
			renderConsentGateFlow(acceptConsents);
			const interaction = userEvent.setup();

			await interaction.click(screen.getByRole("checkbox"));
			await interaction.click(
				screen.getByRole("button", { name: i18n.t("auth.consentGate.button") })
			);

			await waitFor(() => {
				expect(acceptConsents).toHaveBeenCalledTimes(1);
			});
			expect(screen.getByText(i18n.t("auth.consentGate.title"))).toBeInTheDocument();
			expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
		});
	});
});
