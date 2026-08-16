// @vitest-environment jsdom
import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DataStatus } from "~/libs/enums/enums";
import { i18n } from "~/libs/modules/localization/localization";
import { reducer as authReducer } from "~/modules/auth/slices/auth.slice";
import { type UserProfileDto } from "~/modules/profile/profile";
import { reducer as profileReducer } from "~/modules/profile/slices/profile.slice";
import { ProfilePage } from "~/pages/pages";

const PROFILE: UserProfileDto = {
	email: "parent@example.com",
	name: "Parent",
	stats: {
		completedLevels: 2,
		correctAnswersPercentage: 90,
		totalLevels: 10,
		totalScore: 150,
	},
};

const setup = (hasPassword: boolean): void => {
	const mockProfileApi = { getProfile: vi.fn(() => Promise.resolve(PROFILE)) };

	const store = configureStore({
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				thunk: { extraArgument: { profileApi: mockProfileApi } },
			}),
		preloadedState: {
			auth: {
				consentCurrent: true,
				dataStatus: DataStatus.FULFILLED,
				error: null,
				isAuthenticated: true,
				user: {
					email: PROFILE.email,
					has_password: hasPassword,
					id: 1,
					is_admin: false,
					name: PROFILE.name,
				},
			},
		},
		reducer: { auth: authReducer, profile: profileReducer },
	});

	render(
		<Provider store={store}>
			<MemoryRouter>
				<ProfilePage />
			</MemoryRouter>
		</Provider>
	);
};

describe("ProfilePage", () => {
	afterEach(() => {
		cleanup();
	});

	it("shows the change-password form for password accounts", async () => {
		setup(true);

		expect(
			await screen.findByRole("heading", { name: i18n.t("profile.changePassword.title") })
		).toBeInTheDocument();
	});

	it("hides the change-password form for password-less accounts", async () => {
		setup(false);

		// Wait until the page content is rendered before asserting the absence.
		expect(
			await screen.findByRole("heading", { name: i18n.t("profile.deleteAccount.title") })
		).toBeInTheDocument();
		expect(
			screen.queryByRole("heading", { name: i18n.t("profile.changePassword.title") })
		).not.toBeInTheDocument();
	});
});
