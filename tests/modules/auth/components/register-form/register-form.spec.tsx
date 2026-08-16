// @vitest-environment jsdom
import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getLabelWithAsterisk } from "@tests/libs/helpers/dom.helpers";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { VALIDATION_MESSAGES, VALIDATION_RULES } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
import { i18n } from "~/libs/modules/localization/localization";
import { type AsyncThunkConfig } from "~/libs/types/types";
import { RegisterForm } from "~/modules/auth/components/components";
import { reducer as authReducer } from "~/modules/auth/slices/auth.slice";

type AuthState = {
	consentCurrent: boolean;
	dataStatus: (typeof DataStatus)[keyof typeof DataStatus];
	error: null | { message: string };
	isAuthenticated: boolean;
	user: null | { email: string; has_password: boolean; id: number; is_admin: boolean; name: string };
};

type ThunkExtra = AsyncThunkConfig["extra"];

const REQUIRED_FIELD_COUNT = 5;
const FIRST_MATCH_INDEX = 0;

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
	initialAuthState?: Partial<AuthState>
): ReturnType<typeof render> & { store: ReturnType<typeof createMockStore> } => {
	const store = createMockStore(initialAuthState);

	return {
		...render(
			<Provider store={store}>
				<MemoryRouter>{ui}</MemoryRouter>
			</Provider>
		),
		store,
	};
};

// The real register thunk runs against a stubbed thunk extra, so the payload
// assertion happens at the api boundary without mocking the auth barrel
// (mocking it breaks on the barrel <-> components circular import).
const renderWithApiStub = (): {
	authApiMock: { register: ReturnType<typeof vi.fn> };
} => {
	const authApiMock = {
		register: vi.fn(() =>
			Promise.resolve({
				access_token: "test-token",
				consent_current: true,
				user: { email: "test@example.com", has_password: true, id: 1, is_admin: false, name: "John Doe" },
			})
		),
	};
	const storageMock = { set: vi.fn(() => Promise.resolve()) };
	const store = configureStore({
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				thunk: {
					extraArgument: { authApi: authApiMock, storage: storageMock } as unknown as ThunkExtra,
				},
			}),
		reducer: { auth: authReducer },
	});

	render(
		<Provider store={store}>
			<MemoryRouter>
				<RegisterForm />
			</MemoryRouter>
		</Provider>
	);

	return { authApiMock };
};

const fillValidFields = async (user: ReturnType<typeof userEvent.setup>): Promise<void> => {
	await user.type(
		screen.getByLabelText(getLabelWithAsterisk(i18n.t("auth.register.fields.name.label"))),
		"John Doe"
	);
	await user.type(
		screen.getByLabelText(getLabelWithAsterisk(i18n.t("auth.register.fields.email.label"))),
		"test@example.com"
	);
	await user.type(
		screen.getByLabelText(getLabelWithAsterisk(i18n.t("auth.register.fields.password.label"))),
		"Password123"
	);
	await user.type(
		screen.getByLabelText(
			getLabelWithAsterisk(i18n.t("auth.register.fields.confirmPassword.label"))
		),
		"Password123"
	);
};

describe("RegisterForm", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	describe("Rendering", () => {
		it("renders name input field", () => {
			renderWithProvider(<RegisterForm />);

			const nameInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.name.label"))
			);
			expect(nameInput).toBeInTheDocument();
			expect(nameInput).toHaveAttribute("type", "text");
			expect(nameInput).toHaveAttribute(
				"placeholder",
				i18n.t("auth.register.fields.name.placeholder")
			);
		});

		it("renders email input field", () => {
			renderWithProvider(<RegisterForm />);

			const emailInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.email.label"))
			);
			expect(emailInput).toBeInTheDocument();
			expect(emailInput).toHaveAttribute("type", "email");
			expect(emailInput).toHaveAttribute(
				"placeholder",
				i18n.t("auth.register.fields.email.placeholder")
			);
		});

		it("renders password input field", () => {
			renderWithProvider(<RegisterForm />);

			const passwordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.password.label"))
			);
			expect(passwordInput).toBeInTheDocument();
			expect(passwordInput).toHaveAttribute("type", "password");
			expect(passwordInput).toHaveAttribute(
				"placeholder",
				i18n.t("auth.register.fields.password.placeholder")
			);
		});

		it("renders confirm password input field", () => {
			renderWithProvider(<RegisterForm />);

			const confirmPasswordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.confirmPassword.label"))
			);
			expect(confirmPasswordInput).toBeInTheDocument();
			expect(confirmPasswordInput).toHaveAttribute("type", "password");
			expect(confirmPasswordInput).toHaveAttribute(
				"placeholder",
				i18n.t("auth.register.fields.confirmPassword.placeholder")
			);
		});

		it("renders submit button with correct text", () => {
			renderWithProvider(<RegisterForm />);

			const submitButton = screen.getByRole("button", { name: i18n.t("auth.register.button") });
			expect(submitButton).toBeInTheDocument();
			expect(submitButton).toHaveAttribute("type", "submit");
		});

		it("renders required indicators for all fields", () => {
			renderWithProvider(<RegisterForm />);

			const requiredIndicators = screen.getAllByText("*");
			expect(requiredIndicators).toHaveLength(REQUIRED_FIELD_COUNT);
		});

		it("displays global error when present in state", () => {
			const errorMessage = "User already exists";
			renderWithProvider(<RegisterForm />, { error: { message: errorMessage } });

			const errorAlert = screen.getByRole("alert");
			expect(errorAlert).toBeInTheDocument();
			expect(errorAlert).toHaveTextContent(errorMessage);
		});

		it("does not display error alert when no error in state", () => {
			renderWithProvider(<RegisterForm />);

			const errorAlert = screen.queryByRole("alert");
			expect(errorAlert).not.toBeInTheDocument();
		});
	});

	describe("Loading State", () => {
		it("shows loading state on button when request is pending", () => {
			renderWithProvider(<RegisterForm />, { dataStatus: DataStatus.PENDING });

			const submitButton = screen.getByRole("button", { name: i18n.t("auth.register.button") });
			const spinner = screen.getByRole("status");

			expect(submitButton).toBeInTheDocument();
			expect(submitButton).toBeDisabled();
			expect(submitButton).toHaveAttribute("aria-busy", "true");
			expect(spinner).toBeInTheDocument();
		});
	});

	describe("Form Validation", () => {
		it("shows validation error when name is empty", async () => {
			const user = userEvent.setup();
			renderWithProvider(<RegisterForm />);

			const emailInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.email.label"))
			);
			const passwordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.password.label"))
			);
			const confirmPasswordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.confirmPassword.label"))
			);

			await user.type(emailInput, "test@example.com");
			await user.type(passwordInput, "Password123");
			await user.type(confirmPasswordInput, "Password123");

			const submitButton = screen.getByRole("button", { name: i18n.t("auth.register.button") });
			await user.click(submitButton);

			await waitFor(() => {
				expect(screen.getByText(i18n.t(VALIDATION_MESSAGES.MIN_NAME_LENGTH))).toBeInTheDocument();
			});
		});

		it("shows validation error for invalid email", async () => {
			const user = userEvent.setup();
			renderWithProvider(<RegisterForm />);

			const nameInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.name.label"))
			);
			const emailInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.email.label"))
			);
			const passwordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.password.label"))
			);
			const confirmPasswordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.confirmPassword.label"))
			);

			await user.type(nameInput, "John Doe");
			await user.type(emailInput, "not-an-email");
			await user.type(passwordInput, "Password123");
			await user.type(confirmPasswordInput, "Password123");

			const submitButton = screen.getByRole("button", { name: i18n.t("auth.register.button") });
			await user.click(submitButton);

			await waitFor(() => {
				expect(
					screen.getByText(i18n.t(VALIDATION_MESSAGES.INVALID_EMAIL_FORMAT))
				).toBeInTheDocument();
			});
		});

		it("shows validation error for password without number", async () => {
			const user = userEvent.setup();
			renderWithProvider(<RegisterForm />);

			const nameInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.name.label"))
			);
			const emailInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.email.label"))
			);
			const passwordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.password.label"))
			);
			const confirmPasswordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.confirmPassword.label"))
			);

			await user.type(nameInput, "John Doe");
			await user.type(emailInput, "test@example.com");
			await user.type(passwordInput, "PasswordOnly");
			await user.type(confirmPasswordInput, "PasswordOnly");

			const submitButton = screen.getByRole("button", { name: i18n.t("auth.register.button") });
			await user.click(submitButton);

			await waitFor(() => {
				expect(
					screen.getAllByText(i18n.t(VALIDATION_MESSAGES.PW_CONTAINS_NUMBER))[FIRST_MATCH_INDEX]
				).toBeInTheDocument();
			});
		});

		it("shows validation error for too short password", async () => {
			const user = userEvent.setup();
			renderWithProvider(<RegisterForm />);

			const nameInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.name.label"))
			);
			const emailInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.email.label"))
			);
			const passwordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.password.label"))
			);
			const confirmPasswordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.confirmPassword.label"))
			);

			await user.type(nameInput, "John Doe");
			await user.type(emailInput, "test@example.com");
			await user.type(passwordInput, "pa1");
			await user.type(confirmPasswordInput, "pa1");

			const submitButton = screen.getByRole("button", { name: i18n.t("auth.register.button") });
			await user.click(submitButton);

			await waitFor(() => {
				expect(
					screen.getAllByText(
						i18n.t(VALIDATION_MESSAGES.MIN_PW_LENGTH, { min: VALIDATION_RULES.MIN_PASSWORD_LENGTH })
					)[FIRST_MATCH_INDEX]
				).toBeInTheDocument();
			});
		});

		it("blocks submit and shows an error while the consent checkbox is unchecked", async () => {
			const user = userEvent.setup();
			const { authApiMock } = renderWithApiStub();

			await fillValidFields(user);
			await user.click(screen.getByRole("button", { name: i18n.t("auth.register.button") }));

			await waitFor(() => {
				expect(
					screen.getByText(i18n.t(VALIDATION_MESSAGES.TERMS_MUST_BE_ACCEPTED))
				).toBeInTheDocument();
			});
			expect(authApiMock.register).not.toHaveBeenCalled();
		});

		it("submits a payload that includes the consent flag once checked", async () => {
			const user = userEvent.setup();
			const { authApiMock } = renderWithApiStub();

			await fillValidFields(user);
			await user.click(screen.getByRole("checkbox"));
			await user.click(screen.getByRole("button", { name: i18n.t("auth.register.button") }));

			await waitFor(() => {
				expect(authApiMock.register).toHaveBeenCalledWith(
					expect.objectContaining({
						accepted_terms: true,
						email: "test@example.com",
						name: "John Doe",
					})
				);
			});
		});

		it("shows validation error when passwords do not match", async () => {
			const user = userEvent.setup();
			renderWithProvider(<RegisterForm />);

			const nameInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.name.label"))
			);
			const emailInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.email.label"))
			);
			const passwordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.password.label"))
			);
			const confirmPasswordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.confirmPassword.label"))
			);

			await user.type(nameInput, "John Doe");
			await user.type(emailInput, "test@example.com");
			await user.type(passwordInput, "Password123");
			await user.type(confirmPasswordInput, "Password321");

			const submitButton = screen.getByRole("button", { name: i18n.t("auth.register.button") });
			await user.click(submitButton);

			await waitFor(() => {
				expect(screen.getByText(i18n.t(VALIDATION_MESSAGES.PW_DO_NOT_MATCH))).toBeInTheDocument();
			});
		});
	});

	describe("User Interaction", () => {
		it("allows user to type in all fields", async () => {
			const user = userEvent.setup();
			renderWithProvider(<RegisterForm />);

			const nameInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.name.label"))
			);
			const emailInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.email.label"))
			);
			const passwordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.password.label"))
			);
			const confirmPasswordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.confirmPassword.label"))
			);

			await user.type(nameInput, "John Doe");
			await user.type(emailInput, "test@example.com");
			await user.type(passwordInput, "Password123");
			await user.type(confirmPasswordInput, "Password123");

			expect(nameInput).toHaveValue("John Doe");
			expect(emailInput).toHaveValue("test@example.com");
			expect(passwordInput).toHaveValue("Password123");
			expect(confirmPasswordInput).toHaveValue("Password123");
		});
	});

	describe("Accessibility", () => {
		it("has accessible name input with correct label", () => {
			renderWithProvider(<RegisterForm />);

			const nameInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.name.label"))
			);
			expect(nameInput).toHaveAttribute("aria-required", "true");
		});

		it("has accessible email input with correct label", () => {
			renderWithProvider(<RegisterForm />);

			const emailInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.email.label"))
			);
			expect(emailInput).toHaveAttribute("aria-required", "true");
		});

		it("has accessible password input with correct label", () => {
			renderWithProvider(<RegisterForm />);

			const passwordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.password.label"))
			);
			expect(passwordInput).toHaveAttribute("aria-required", "true");
		});

		it("has accessible confirm password input with correct label", () => {
			renderWithProvider(<RegisterForm />);

			const confirmPasswordInput = screen.getByLabelText(
				getLabelWithAsterisk(i18n.t("auth.register.fields.confirmPassword.label"))
			);
			expect(confirmPasswordInput).toHaveAttribute("aria-required", "true");
		});

		it("global error has role alert", () => {
			renderWithProvider(<RegisterForm />, { error: { message: "Test error" } });

			const errorAlert = screen.getByRole("alert");
			expect(errorAlert).toBeInTheDocument();
		});
	});
});
