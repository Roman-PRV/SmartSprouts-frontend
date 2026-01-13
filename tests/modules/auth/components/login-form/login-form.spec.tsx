/**
 * @vitest-environment jsdom
 */
import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import "@testing-library/jest-dom/vitest";

import { VALIDATION_MESSAGES, VALIDATION_RULES } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
import { i18n } from "~/libs/modules/localization/localization";
import { LoginForm } from "~/modules/auth/components/components";
import { reducer as authReducer } from "~/modules/auth/slices/auth.slice";
import { getLabelWithAsterisk } from "@tests/libs/helpers/dom.helpers";

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
	initialAuthState?: Partial<AuthState>
) => {
	const store = createMockStore(initialAuthState);
	return {
		...render(<Provider store={store}>{ui}</Provider>),
		store,
	};
};

describe("LoginForm", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	describe("Rendering", () => {
		it("renders email input field", () => {
			renderWithProvider(<LoginForm />);

			const emailInput = screen.getByLabelText(getLabelWithAsterisk(i18n.t("auth.login.fields.email.label")));
			expect(emailInput).toBeInTheDocument();
			expect(emailInput).toHaveAttribute("type", "email");
			expect(emailInput).toHaveAttribute("placeholder", i18n.t("auth.login.fields.email.placeholder"));
		});

		it("renders password input field", () => {
			renderWithProvider(<LoginForm />);

			const passwordInput = screen.getByLabelText(getLabelWithAsterisk(i18n.t("auth.login.fields.password.label")));
			expect(passwordInput).toBeInTheDocument();
			expect(passwordInput).toHaveAttribute("type", "password");
			expect(passwordInput).toHaveAttribute("placeholder", i18n.t("auth.login.fields.password.placeholder"));
		});

		it("renders submit button with correct text", () => {
			renderWithProvider(<LoginForm />);

			const submitButton = screen.getByRole("button", { name: i18n.t("auth.login.button") });
			expect(submitButton).toBeInTheDocument();
			expect(submitButton).toHaveAttribute("type", "submit");
		});

		it("renders required indicators for email and password", () => {
			renderWithProvider(<LoginForm />);

			const requiredIndicators = screen.getAllByText("*");
			expect(requiredIndicators).toHaveLength(2);
		});

		it("displays global error when present in state", () => {
			const errorMessage = "Invalid credentials";
			renderWithProvider(<LoginForm />, { error: errorMessage });

			const errorAlert = screen.getByRole("alert");
			expect(errorAlert).toBeInTheDocument();
			expect(errorAlert).toHaveTextContent(errorMessage);
		});

		it("does not display error alert when no error in state", () => {
			renderWithProvider(<LoginForm />);

			const errorAlert = screen.queryByRole("alert");
			expect(errorAlert).not.toBeInTheDocument();
		});
	});

	describe("Loading State", () => {
		it("shows loading state on button when request is pending", () => {
			renderWithProvider(<LoginForm />, { dataStatus: DataStatus.PENDING });

			const submitButton = screen.getByRole("button", { name: i18n.t("auth.login.button") });
			const spinner = screen.getByRole("status");

			expect(submitButton).toBeInTheDocument();
			expect(submitButton).toBeDisabled();
			expect(submitButton).toHaveAttribute("aria-busy", "true");
			expect(spinner).toBeInTheDocument();
		});
	});

	describe("Form Validation", () => {
		it("shows validation error for password without number", async () => {
			const user = userEvent.setup();
			renderWithProvider(<LoginForm />);

			const emailInput = screen.getByLabelText(getLabelWithAsterisk(i18n.t("auth.login.fields.email.label")));
			const passwordInput = screen.getByLabelText(getLabelWithAsterisk(i18n.t("auth.login.fields.password.label")));

			await user.type(emailInput, "test@example.com");
			await user.type(passwordInput, "passwordonly");

			const submitButton = screen.getByRole("button", { name: i18n.t("auth.login.button") });
			await user.click(submitButton);

			await waitFor(() => {
				expect(
					screen.getByText(i18n.t(VALIDATION_MESSAGES.PW_CONTAINS_NUMBER))
				).toBeInTheDocument();
			});
		});

		it("shows validation error for too short password", async () => {
			const user = userEvent.setup();
			renderWithProvider(<LoginForm />);

			const emailInput = screen.getByLabelText(getLabelWithAsterisk(i18n.t("auth.login.fields.email.label")));
			const passwordInput = screen.getByLabelText(getLabelWithAsterisk(i18n.t("auth.login.fields.password.label")));

			await user.type(emailInput, "test@example.com");
			await user.type(passwordInput, "pa1");

			const submitButton = screen.getByRole("button", { name: i18n.t("auth.login.button") });
			await user.click(submitButton);

			await waitFor(() => {
				expect(
					screen.getByText(i18n.t(VALIDATION_MESSAGES.MIN_PW_LENGTH, { min: VALIDATION_RULES.MIN_PASSWORD_LENGTH }))
				).toBeInTheDocument();
			});
		});
	});

	describe("User Interaction", () => {
		it("allows user to type in email field", async () => {
			const user = userEvent.setup();
			renderWithProvider(<LoginForm />);

			const emailInput = screen.getByLabelText(getLabelWithAsterisk(i18n.t("auth.login.fields.email.label")));
			await user.type(emailInput, "test@example.com");

			expect(emailInput).toHaveValue("test@example.com");
		});

		it("allows user to type in password field", async () => {
			const user = userEvent.setup();
			renderWithProvider(<LoginForm />);

			const passwordInput = screen.getByLabelText(getLabelWithAsterisk(i18n.t("auth.login.fields.password.label")));
			await user.type(passwordInput, "password123");

			expect(passwordInput).toHaveValue("password123");
		});
	});

	describe("Accessibility", () => {
		it("has accessible email input with correct label", () => {
			renderWithProvider(<LoginForm />);

			const emailInput = screen.getByLabelText(getLabelWithAsterisk(i18n.t("auth.login.fields.email.label")));
			expect(emailInput).toHaveAttribute("aria-required", "true");
		});

		it("has accessible password input with correct label", () => {
			renderWithProvider(<LoginForm />);

			const passwordInput = screen.getByLabelText(getLabelWithAsterisk(i18n.t("auth.login.fields.password.label")));
			expect(passwordInput).toHaveAttribute("aria-required", "true");
		});

		it("global error has role alert", () => {
			renderWithProvider(<LoginForm />, { error: "Test error" });

			const errorAlert = screen.getByRole("alert");
			expect(errorAlert).toBeInTheDocument();
		});
	});
});
