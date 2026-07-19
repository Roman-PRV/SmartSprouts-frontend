// @vitest-environment jsdom
import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getLabelWithAsterisk } from "@tests/libs/helpers/dom.helpers";
import "@testing-library/jest-dom/vitest";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { VALIDATION_MESSAGES } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
import { i18n } from "~/libs/modules/localization/localization";
import { reducer as authReducer } from "~/modules/auth/slices/auth.slice";
import { DeleteAccountSection } from "~/pages/profile-page/components/components";

const VALID_PASSWORD = "password123";
const VALID_CODE = "483920";

type Setup = {
	deleteAccount: ReturnType<typeof vi.fn>;
	logout: ReturnType<typeof vi.fn>;
	requestDeletionCode: ReturnType<typeof vi.fn>;
};

const setup = (hasPassword: boolean): Setup => {
	const deleteAccount = vi.fn(() => Promise.resolve());
	const requestDeletionCode = vi.fn(() => Promise.resolve());
	const logout = vi.fn(() => Promise.resolve());
	const mockProfileApi = { deleteAccount, requestDeletionCode };
	const mockAuthApi = { logout };
	const mockStorage = {
		drop: vi.fn(() => Promise.resolve()),
		get: vi.fn(() => Promise.resolve(null)),
		set: vi.fn(() => Promise.resolve()),
	};

	const store = configureStore({
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				thunk: {
					extraArgument: {
						authApi: mockAuthApi,
						profileApi: mockProfileApi,
						storage: mockStorage,
					},
				},
			}),
		preloadedState: {
			auth: {
				consentCurrent: true,
				dataStatus: DataStatus.FULFILLED,
				error: null,
				isAuthenticated: true,
				user: {
					email: "parent@example.com",
					has_password: hasPassword,
					id: 1,
					is_admin: false,
					name: "Parent",
				},
			},
		},
		reducer: { auth: authReducer },
	});

	render(
		<Provider store={store}>
			<MemoryRouter>
				<DeleteAccountSection />
			</MemoryRouter>
		</Provider>
	);

	return { deleteAccount, logout, requestDeletionCode };
};

const openModal = async (user: ReturnType<typeof userEvent.setup>): Promise<void> => {
	await user.click(screen.getByRole("button", { name: i18n.t("profile.deleteAccount.button") }));
};

describe("DeleteAccountSection", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders the danger card with the delete button", () => {
		setup(true);

		expect(screen.getByText(i18n.t("profile.deleteAccount.title"))).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: i18n.t("profile.deleteAccount.button") })
		).toBeInTheDocument();
	});

	describe("password account", () => {
		it("confirms with the password and ends the session", async () => {
			const user = userEvent.setup();
			const { deleteAccount, logout } = setup(true);

			await openModal(user);
			await user.type(
				screen.getByLabelText(
					getLabelWithAsterisk(i18n.t("profile.deleteAccount.passwordField.label"))
				),
				VALID_PASSWORD
			);
			await user.click(
				screen.getByRole("button", { name: i18n.t("profile.deleteAccount.confirm") })
			);

			await waitFor(() => {
				expect(deleteAccount).toHaveBeenCalledWith({ password: VALID_PASSWORD });
			});
			await waitFor(() => {
				expect(logout).toHaveBeenCalledTimes(1);
			});
		});

		it("does not offer the emailed code path", async () => {
			const user = userEvent.setup();
			setup(true);

			await openModal(user);

			expect(
				screen.queryByRole("button", { name: i18n.t("profile.deleteAccount.sendCode") })
			).not.toBeInTheDocument();
		});

		it("rejects an empty password client-side", async () => {
			const user = userEvent.setup();
			const { deleteAccount } = setup(true);

			await openModal(user);
			await user.click(
				screen.getByRole("button", { name: i18n.t("profile.deleteAccount.confirm") })
			);

			await waitFor(() => {
				expect(screen.getByText(i18n.t(VALIDATION_MESSAGES.PW_REQUIRED))).toBeInTheDocument();
			});
			expect(deleteAccount).not.toHaveBeenCalled();
		});
	});

	describe("password-less (Google) account", () => {
		it("requests an emailed code, then confirms deletion with it", async () => {
			const user = userEvent.setup();
			const { deleteAccount, logout, requestDeletionCode } = setup(false);

			await openModal(user);

			expect(
				screen.queryByLabelText(
					getLabelWithAsterisk(i18n.t("profile.deleteAccount.passwordField.label"))
				)
			).not.toBeInTheDocument();

			await user.click(
				screen.getByRole("button", { name: i18n.t("profile.deleteAccount.sendCode") })
			);

			await waitFor(() => {
				expect(requestDeletionCode).toHaveBeenCalledTimes(1);
			});

			await user.type(
				screen.getByLabelText(getLabelWithAsterisk(i18n.t("profile.deleteAccount.codeField.label"))),
				VALID_CODE
			);
			await user.click(
				screen.getByRole("button", { name: i18n.t("profile.deleteAccount.confirm") })
			);

			await waitFor(() => {
				expect(deleteAccount).toHaveBeenCalledWith({ code: VALID_CODE });
			});
			await waitFor(() => {
				expect(logout).toHaveBeenCalledTimes(1);
			});
		});

		it("rejects a malformed code client-side", async () => {
			const user = userEvent.setup();
			const { deleteAccount } = setup(false);

			await openModal(user);
			await user.click(
				screen.getByRole("button", { name: i18n.t("profile.deleteAccount.sendCode") })
			);
			await user.type(
				screen.getByLabelText(getLabelWithAsterisk(i18n.t("profile.deleteAccount.codeField.label"))),
				"12"
			);
			await user.click(
				screen.getByRole("button", { name: i18n.t("profile.deleteAccount.confirm") })
			);

			await waitFor(() => {
				expect(
					screen.getByText(i18n.t(VALIDATION_MESSAGES.DELETION_CODE_FORMAT))
				).toBeInTheDocument();
			});
			expect(deleteAccount).not.toHaveBeenCalled();
		});
	});
});
