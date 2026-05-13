import type * as ReactRouterDomModule from "react-router-dom";

// @vitest-environment jsdom
import { configureStore } from "@reduxjs/toolkit";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { useNavigate } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type * as AuthModule from "~/modules/auth/auth";

import { AppRoute } from "~/libs/enums/enums";
import { i18n } from "~/libs/modules/localization/localization";
import { loginWithGoogle } from "~/modules/auth/auth";
import { reducer as authReducer } from "~/modules/auth/slices/auth.slice";
import { AuthGoogleCallbackPage } from "~/pages/auth-google-callback-page/auth-google-callback-page";

vi.mock("react-router-dom", async (importOriginal) => {
	const actual = await importOriginal<typeof ReactRouterDomModule>();

	return {
		...actual,
		useNavigate: vi.fn().mockReturnValue(vi.fn()),
	};
});

vi.mock("~/modules/auth/auth", async (importOriginal) => {
	const actual = await importOriginal<typeof AuthModule>();
	const mockLoginWithGoogle = vi.fn();
	Object.assign(mockLoginWithGoogle, actual.loginWithGoogle);

	return { ...actual, loginWithGoogle: mockLoginWithGoogle };
});

const createMockStore = (): ReturnType<typeof configureStore> =>
	configureStore({ reducer: { auth: authReducer } });

const renderPage = (): ReturnType<typeof render> =>
	render(
		<Provider store={createMockStore()}>
			<AuthGoogleCallbackPage />
		</Provider>
	);

const makeMockAction = (resolves: boolean): ReturnType<typeof vi.fn> =>
	vi.fn().mockImplementation(() => ({
		unwrap: resolves
			? vi.fn().mockResolvedValue({ email: "u@example.com", id: 1, name: "User" })
			: vi.fn().mockRejectedValue(new Error("sign-in failed")),
	}));

describe("AuthGoogleCallbackPage", () => {
	let mockNavigate: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockNavigate = vi.fn();
		vi.mocked(useNavigate).mockReturnValue(mockNavigate);
		vi.stubGlobal("history", { replaceState: vi.fn() });
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.unstubAllGlobals();
		cleanup();
	});

	describe("with access_token in hash", () => {
		beforeEach(() => {
			vi.stubGlobal("location", {
				hash: "#access_token=google-token-123",
				pathname: "/auth/google/callback",
			});
		});

		it("dispatches loginWithGoogle with the token from hash", async () => {
			vi.mocked(loginWithGoogle).mockReturnValue(makeMockAction(true) as never);

			renderPage();

			await waitFor(() => {
				expect(vi.mocked(loginWithGoogle)).toHaveBeenCalledWith("google-token-123");
			});
		});

		it("navigates to ROOT on successful sign-in", async () => {
			vi.mocked(loginWithGoogle).mockReturnValue(makeMockAction(true) as never);

			renderPage();

			await waitFor(() => {
				expect(mockNavigate).toHaveBeenCalledWith(AppRoute.ROOT);
			});
		});

		it("navigates to LOGIN with googleError when dispatch fails", async () => {
			vi.mocked(loginWithGoogle).mockReturnValue(makeMockAction(false) as never);

			renderPage();

			await waitFor(() => {
				expect(mockNavigate).toHaveBeenCalledWith(AppRoute.LOGIN, {
					state: {
						googleError: i18n.t("auth.googleCallback.errors.authFailed"),
					},
				});
			});
		});
	});

	describe("with error in hash", () => {
		it("navigates to LOGIN with invalidState message for invalid_state error", async () => {
			vi.stubGlobal("location", {
				hash: "#error=invalid_state",
				pathname: "/auth/google/callback",
			});

			renderPage();

			await waitFor(() => {
				expect(mockNavigate).toHaveBeenCalledWith(AppRoute.LOGIN, {
					state: {
						googleError: i18n.t("auth.googleCallback.errors.invalidState"),
					},
				});
			});
		});

		it("navigates to LOGIN with authFailed message for auth_failed error", async () => {
			vi.stubGlobal("location", {
				hash: "#error=auth_failed",
				pathname: "/auth/google/callback",
			});

			renderPage();

			await waitFor(() => {
				expect(mockNavigate).toHaveBeenCalledWith(AppRoute.LOGIN, {
					state: {
						googleError: i18n.t("auth.googleCallback.errors.authFailed"),
					},
				});
			});
		});

		it("navigates to LOGIN with fallback authFailed message for unknown error code", async () => {
			vi.stubGlobal("location", {
				hash: "#error=unknown_error_code",
				pathname: "/auth/google/callback",
			});

			renderPage();

			await waitFor(() => {
				expect(mockNavigate).toHaveBeenCalledWith(AppRoute.LOGIN, {
					state: {
						googleError: i18n.t("auth.googleCallback.errors.authFailed"),
					},
				});
			});
		});
	});

	describe("with empty hash", () => {
		it("navigates to LOGIN when no token or error is present", async () => {
			vi.stubGlobal("location", {
				hash: "",
				pathname: "/auth/google/callback",
			});

			renderPage();

			await waitFor(() => {
				expect(mockNavigate).toHaveBeenCalledWith(AppRoute.LOGIN);
			});
		});
	});

	describe("rendering", () => {
		it("renders loading text while processing", () => {
			vi.stubGlobal("location", {
				hash: "",
				pathname: "/auth/google/callback",
			});
			vi.mocked(loginWithGoogle).mockReturnValue(makeMockAction(true) as never);

			const { getByText } = renderPage();

			expect(getByText(i18n.t("auth.googleCallback.loading"))).toBeInTheDocument();
		});
	});
});
