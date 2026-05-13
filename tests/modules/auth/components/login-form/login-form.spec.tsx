// @vitest-environment jsdom
import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getLabelWithAsterisk } from "@tests/libs/helpers/dom.helpers";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { VALIDATION_MESSAGES } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
import { i18n } from "~/libs/modules/localization/localization";
import { LoginForm } from "~/modules/auth/components/components";
import { reducer as authReducer } from "~/modules/auth/slices/auth.slice";

type AuthState = ReturnType<typeof authReducer>;

const REQUIRED_FIELD_COUNT = 2;
const VALID_CREDENTIAL_VALUE = "password123";

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
	initialAuthState?: Partial<AuthState>
): ReturnType<typeof render> => {
	const store = createMockStore(initialAuthState);

	return render(
		<Provider store={store}>
			<MemoryRouter>{ui}</MemoryRouter>
		</Provider>
	);
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

			const emailInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.login.fields.email.label"))
			);
			expect(emailInput).toBeInTheDocument();
			expect(emailInput).toHaveAttribute("type", "email");
			expect(emailInput).toHaveAttribute(
				"placeholder",
				i18n.t("auth.login.fields.email.placeholder")
			);
		});

		it("renders password input field", () => {
			renderWithProvider(<LoginForm />);

			const passwordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.login.fields.password.label"))
			);
			expect(passwordInput).toBeInTheDocument();
			expect(passwordInput).toHaveAttribute("type", "password");
			expect(passwordInput).toHaveAttribute(
				"placeholder",
				i18n.t("auth.login.fields.password.placeholder")
			);
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
			expect(requiredIndicators).toHaveLength(REQUIRED_FIELD_COUNT);
		});

		it("displays global error when present in state", () => {
			const errorMessage = "Invalid credentials";
			renderWithProvider(<LoginForm />, { error: { message: errorMessage } });

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
		it("shows validation error for empty password", async () => {
			const user = userEvent.setup();
			renderWithProvider(<LoginForm />);

			const emailInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.login.fields.email.label"))
			);
			const submitButton = screen.getByRole("button", { name: i18n.t("auth.login.button") });

			await user.type(emailInput, "test@example.com");
			await user.click(submitButton);

			await waitFor(() => {
				expect(
					screen.getByText(i18n.t(VALIDATION_MESSAGES.PW_REQUIRED))
				).toBeInTheDocument();
			});
		});

		it("does not validate password complexity", async () => {
			const user = userEvent.setup();
			renderWithProvider(<LoginForm />);

			const emailInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.login.fields.email.label"))
			);
			const passwordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.login.fields.password.label"))
			);

			await user.type(emailInput, "test@example.com");
			await user.type(passwordInput, "123");

			const submitButton = screen.getByRole("button", { name: i18n.t("auth.login.button") });
			await user.click(submitButton);

			await waitFor(() => {
				expect(
					screen.queryByText(i18n.t(VALIDATION_MESSAGES.PW_CONTAINS_NUMBER))
				).not.toBeInTheDocument();
				expect(
					screen.queryByText(i18n.t(VALIDATION_MESSAGES.PW_CONTAINS_LOWERCASE))
				).not.toBeInTheDocument();
			});
		});
	});

	describe("User Interaction", () => {
		it("allows user to type in email field", async () => {
			const user = userEvent.setup();
			renderWithProvider(<LoginForm />);

			const emailInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.login.fields.email.label"))
			);
			await user.type(emailInput, "test@example.com");

			expect(emailInput).toHaveValue("test@example.com");
		});

		it("allows user to type in password field", async () => {
			const user = userEvent.setup();
			renderWithProvider(<LoginForm />);

			const passwordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.login.fields.password.label"))
			);
			await user.type(passwordInput, "password123");

			expect(passwordInput).toHaveValue("password123");
		});
	});

	describe("Form Submission", () => {
		it("calls authApi.login with correct credentials on valid submit", async () => {
			const user = userEvent.setup();
			const mockAuthApi = {
				login: vi.fn().mockResolvedValue({
					access_token: "token",
					user: { email: "test@example.com", id: 1, name: "Test User" },
				}),
			};
			const mockStorage = { drop: vi.fn(), get: vi.fn(), set: vi.fn().mockImplementation(() => Promise.resolve()) };
			const store = configureStore({
				middleware: (getDefaultMiddleware) =>
					getDefaultMiddleware({
						thunk: { extraArgument: { authApi: mockAuthApi, storage: mockStorage } },
					}),
				preloadedState: { auth: { dataStatus: DataStatus.IDLE, error: null, isAuthenticated: false, user: null } },
				reducer: { auth: authReducer },
			});

			render(
				<Provider store={store}>
					<MemoryRouter>
						<LoginForm />
					</MemoryRouter>
				</Provider>
			);

			await user.type(
				screen.getByLabelText(getLabelWithAsterisk(i18n.t("auth.login.fields.email.label"))),
				"test@example.com"
			);
			await user.type(
				screen.getByLabelText(getLabelWithAsterisk(i18n.t("auth.login.fields.password.label"))),
				VALID_CREDENTIAL_VALUE
			);
			await user.click(screen.getByRole("button", { name: i18n.t("auth.login.button") }));

			await waitFor(() => {
				expect(mockAuthApi.login).toHaveBeenCalledWith({
					email: "test@example.com",
					password: VALID_CREDENTIAL_VALUE,
				});
			});
		});
	});

	describe("Accessibility", () => {
		it("has accessible email input with correct label", () => {
			renderWithProvider(<LoginForm />);

			const emailInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.login.fields.email.label"))
			);
			expect(emailInput).toHaveAttribute("aria-required", "true");
		});

		it("has accessible password input with correct label", () => {
			renderWithProvider(<LoginForm />);

			const passwordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.login.fields.password.label"))
			);
			expect(passwordInput).toHaveAttribute("aria-required", "true");
		});

		it("global error has role alert", () => {
			renderWithProvider(<LoginForm />, { error: { message: "Test error" } });

			const errorAlert = screen.getByRole("alert");
			expect(errorAlert).toBeInTheDocument();
		});
	});
});
