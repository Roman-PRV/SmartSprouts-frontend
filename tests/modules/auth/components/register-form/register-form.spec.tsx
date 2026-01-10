/**
 * @vitest-environment jsdom
 */
import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import "@testing-library/jest-dom/vitest";

import { VALIDATION_MESSAGES } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
import { RegisterForm } from "~/modules/auth/components/components";
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
	initialAuthState?: Partial<AuthState>
) => {
	const store = createMockStore(initialAuthState);
	return {
		...render(<Provider store={store}>{ui}</Provider>),
		store,
	};
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

			const nameInput = screen.getByLabelText(/name/i);
			expect(nameInput).toBeInTheDocument();
			expect(nameInput).toHaveAttribute("type", "text");
			expect(nameInput).toHaveAttribute("placeholder", "Your name");
		});

		it("renders email input field", () => {
			renderWithProvider(<RegisterForm />);

			const emailInput = screen.getByLabelText(/email/i);
			expect(emailInput).toBeInTheDocument();
			expect(emailInput).toHaveAttribute("type", "email");
			expect(emailInput).toHaveAttribute("placeholder", "your@email.com");
		});

		it("renders password input field", () => {
			renderWithProvider(<RegisterForm />);

			const passwordInput = screen.getByLabelText(/^password/i);
			expect(passwordInput).toBeInTheDocument();
			expect(passwordInput).toHaveAttribute("type", "password");
			expect(passwordInput).toHaveAttribute("placeholder", "Enter password");
		});

		it("renders confirm password input field", () => {
			renderWithProvider(<RegisterForm />);

			const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
			expect(confirmPasswordInput).toBeInTheDocument();
			expect(confirmPasswordInput).toHaveAttribute("type", "password");
			expect(confirmPasswordInput).toHaveAttribute("placeholder", "Confirm password");
		});

		it("renders submit button with correct text", () => {
			renderWithProvider(<RegisterForm />);

			const submitButton = screen.getByRole("button", { name: /register/i });
			expect(submitButton).toBeInTheDocument();
			expect(submitButton).toHaveAttribute("type", "submit");
		});

		it("renders required indicators for all fields", () => {
			renderWithProvider(<RegisterForm />);

			const requiredIndicators = screen.getAllByText("*");
			expect(requiredIndicators).toHaveLength(4);
		});

		it("displays global error when present in state", () => {
			const errorMessage = "User already exists";
			renderWithProvider(<RegisterForm />, { error: errorMessage });

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

			const submitButton = screen.getByRole("button", { name: /register/i });
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

			const emailInput = screen.getByLabelText(/email/i);
			const passwordInput = screen.getByLabelText(/^password/i);
			const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

			await user.type(emailInput, "test@example.com");
			await user.type(passwordInput, "Password123");
			await user.type(confirmPasswordInput, "Password123");

			const submitButton = screen.getByRole("button", { name: /register/i });
			await user.click(submitButton);

			await waitFor(() => {
				expect(
					screen.getByText(VALIDATION_MESSAGES.MIN_NAME_LENGTH)
				).toBeInTheDocument();
			});
		});

		it("shows validation error for invalid email", async () => {
			const user = userEvent.setup();
			renderWithProvider(<RegisterForm />);

			const nameInput = screen.getByLabelText(/name/i);
			const emailInput = screen.getByLabelText(/email/i);
			const passwordInput = screen.getByLabelText(/^password/i);
			const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

			await user.type(nameInput, "John Doe");
			await user.type(emailInput, "not-an-email");
			await user.type(passwordInput, "Password123");
			await user.type(confirmPasswordInput, "Password123");

			const submitButton = screen.getByRole("button", { name: /register/i });
			await user.click(submitButton);

			await waitFor(() => {
				expect(
					screen.getByText(VALIDATION_MESSAGES.INVALID_EMAIL_FORMAT)
				).toBeInTheDocument();
			});
		});

		it("shows validation error for password without number", async () => {
			const user = userEvent.setup();
			renderWithProvider(<RegisterForm />);

			const nameInput = screen.getByLabelText(/name/i);
			const emailInput = screen.getByLabelText(/email/i);
			const passwordInput = screen.getByLabelText(/^password/i);
			const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

			await user.type(nameInput, "John Doe");
			await user.type(emailInput, "test@example.com");
			await user.type(passwordInput, "passwordonly");
			await user.type(confirmPasswordInput, "passwordonly");

			const submitButton = screen.getByRole("button", { name: /register/i });
			await user.click(submitButton);

			await waitFor(() => {
				expect(
					screen.getAllByText(VALIDATION_MESSAGES.PW_CONTAINS_NUMBER)[0]
				).toBeInTheDocument();
			});
		});

		it("shows validation error for too short password", async () => {
			const user = userEvent.setup();
			renderWithProvider(<RegisterForm />);

			const nameInput = screen.getByLabelText(/name/i);
			const emailInput = screen.getByLabelText(/email/i);
			const passwordInput = screen.getByLabelText(/^password/i);
			const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

			await user.type(nameInput, "John Doe");
			await user.type(emailInput, "test@example.com");
			await user.type(passwordInput, "pa1");
			await user.type(confirmPasswordInput, "pa1");

			const submitButton = screen.getByRole("button", { name: /register/i });
			await user.click(submitButton);

			await waitFor(() => {
				expect(
					screen.getAllByText(VALIDATION_MESSAGES.MIN_PW_LENGTH)[0]
				).toBeInTheDocument();
			});
		});

		it("shows validation error when passwords do not match", async () => {
			const user = userEvent.setup();
			renderWithProvider(<RegisterForm />);

			const nameInput = screen.getByLabelText(/name/i);
			const emailInput = screen.getByLabelText(/email/i);
			const passwordInput = screen.getByLabelText(/^password/i);
			const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

			await user.type(nameInput, "John Doe");
			await user.type(emailInput, "test@example.com");
			await user.type(passwordInput, "Password123");
			await user.type(confirmPasswordInput, "Password321");

			const submitButton = screen.getByRole("button", { name: /register/i });
			await user.click(submitButton);

			await waitFor(() => {
				expect(
					screen.getByText(VALIDATION_MESSAGES.PW_DO_NOT_MATCH)
				).toBeInTheDocument();
			});
		});
	});

	describe("User Interaction", () => {
		it("allows user to type in all fields", async () => {
			const user = userEvent.setup();
			renderWithProvider(<RegisterForm />);

			const nameInput = screen.getByLabelText(/name/i);
			const emailInput = screen.getByLabelText(/email/i);
			const passwordInput = screen.getByLabelText(/^password/i);
			const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

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

			const nameInput = screen.getByLabelText(/name/i);
			expect(nameInput).toHaveAttribute("aria-required", "true");
		});

		it("has accessible email input with correct label", () => {
			renderWithProvider(<RegisterForm />);

			const emailInput = screen.getByLabelText(/email/i);
			expect(emailInput).toHaveAttribute("aria-required", "true");
		});

		it("has accessible password input with correct label", () => {
			renderWithProvider(<RegisterForm />);

			const passwordInput = screen.getByLabelText(/^password/i);
			expect(passwordInput).toHaveAttribute("aria-required", "true");
		});

		it("has accessible confirm password input with correct label", () => {
			renderWithProvider(<RegisterForm />);

			const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
			expect(confirmPasswordInput).toHaveAttribute("aria-required", "true");
		});

		it("global error has role alert", () => {
			renderWithProvider(<RegisterForm />, { error: "Test error" });

			const errorAlert = screen.getByRole("alert");
			expect(errorAlert).toBeInTheDocument();
		});
	});
});
