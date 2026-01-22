/**
 * @vitest-environment jsdom
 */
import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import "@testing-library/jest-dom/vitest";

import { DataStatus } from "~/libs/enums/enums";
import { i18n } from "~/libs/modules/localization/localization";
import { Navigation } from "~/libs/components/navigation/navigation";
import { reducer as authReducer } from "~/modules/auth/slices/auth.slice";

type AuthState = {
	dataStatus: (typeof DataStatus)[keyof typeof DataStatus];
	error: null | string;
	isAuthenticated: boolean;
	user: null | { email: string; id: number; name: string };
};

const mockLogout = vi.fn();

vi.mock("~/modules/auth/auth", () => ({
	useLogout: () => ({
		logout: mockLogout,
	}),
}));

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

const renderWithProvider = (initialAuthState?: Partial<AuthState>) => {
	const store = createMockStore(initialAuthState);
	return {
		...render(
			<Provider store={store}>
				<BrowserRouter>
					<Navigation />
				</BrowserRouter>
			</Provider>
		),
		store,
	};
};

describe("Navigation", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	describe("Rendering", () => {
		it("renders all navigation links", () => {
			renderWithProvider();

			expect(screen.getByRole("link", { name: i18n.t("common.navigation.home") })).toBeInTheDocument();
			expect(screen.getByRole("link", { name: i18n.t("common.navigation.games") })).toBeInTheDocument();
			expect(screen.getByRole("link", { name: i18n.t("common.navigation.profile") })).toBeInTheDocument();
		});

		it("renders burger menu button on mobile", () => {
			renderWithProvider();

			const burgerButton = screen.getByRole("button", {
				name: i18n.t("common.navigation.toggleMenu"),
			});
			expect(burgerButton).toBeInTheDocument();
		});
	});

	describe("Logout Button Visibility", () => {
		it("shows logout button in desktop menu when authenticated", () => {
			renderWithProvider({ isAuthenticated: true });

			const desktopNav = screen.getAllByRole("list")[0]!;
			const logoutButton = within(desktopNav).getByRole("button", {
				name: i18n.t("common.navigation.logout"),
			});

			expect(logoutButton).toBeInTheDocument();
		});

		it("does not show logout button in desktop menu when not authenticated", () => {
			renderWithProvider({ isAuthenticated: false });

			const desktopNav = screen.getAllByRole("list")[0]!;
			const logoutButton = within(desktopNav).queryByRole("button", {
				name: i18n.t("common.navigation.logout"),
			});

			expect(logoutButton).not.toBeInTheDocument();
		});

		it("shows logout button in mobile menu when authenticated and menu is open", async () => {
			const user = userEvent.setup();
			renderWithProvider({ isAuthenticated: true });

			const burgerButton = screen.getByRole("button", {
				name: i18n.t("common.navigation.toggleMenu"),
			});
			await user.click(burgerButton);

			const mobileMenu = screen.getAllByRole("list")[1]!;
			const logoutButton = within(mobileMenu).getByRole("button", {
				name: i18n.t("common.navigation.logout"),
			});

			expect(logoutButton).toBeInTheDocument();
		});

		it("does not show logout button in mobile menu when not authenticated", async () => {
			const user = userEvent.setup();
			renderWithProvider({ isAuthenticated: false });

			const burgerButton = screen.getByRole("button", {
				name: i18n.t("common.navigation.toggleMenu"),
			});
			await user.click(burgerButton);

			const mobileMenu = screen.getAllByRole("list")[1]!;
			const logoutButton = within(mobileMenu).queryByRole("button", {
				name: i18n.t("common.navigation.logout"),
			});

			expect(logoutButton).not.toBeInTheDocument();
		});
	});

	describe("Logout Handler", () => {
		it("triggers logout handler when desktop logout button is clicked", async () => {
			const user = userEvent.setup();
			renderWithProvider({ isAuthenticated: true });

			const desktopNav = screen.getAllByRole("list")[0]!;
			const logoutButton = within(desktopNav).getByRole("button", {
				name: i18n.t("common.navigation.logout"),
			});

			await user.click(logoutButton);

			expect(mockLogout).toHaveBeenCalledTimes(1);
		});

		it("triggers logout handler when mobile logout button is clicked", async () => {
			const user = userEvent.setup();
			renderWithProvider({ isAuthenticated: true });

			const burgerButton = screen.getByRole("button", {
				name: i18n.t("common.navigation.toggleMenu"),
			});
			await user.click(burgerButton);

			const mobileMenu = screen.getAllByRole("list")[1]!;
			const logoutButton = within(mobileMenu).getByRole("button", {
				name: i18n.t("common.navigation.logout"),
			});

			await user.click(logoutButton);

			expect(mockLogout).toHaveBeenCalledTimes(1);
		});
	});

	describe("Menu Close on Logout", () => {
		it("closes mobile menu when logout button is clicked", async () => {
			const user = userEvent.setup();
			renderWithProvider({ isAuthenticated: true });

			const burgerButton = screen.getByRole("button", {
				name: i18n.t("common.navigation.toggleMenu"),
			});
			await user.click(burgerButton);

			// Menu should be open
			let mobileMenu: HTMLElement | undefined = screen.queryAllByRole("list")[1];
			expect(mobileMenu).toBeInTheDocument();

			const logoutButton = within(mobileMenu!).getByRole("button", {
				name: i18n.t("common.navigation.logout"),
			});
			await user.click(logoutButton);

			// Menu should be closed after logout
			mobileMenu = screen.queryAllByRole("list")[1];
			expect(mobileMenu).toBeUndefined();
		});
	});

	describe("Mobile Menu Interaction", () => {
		it("opens mobile menu when burger button is clicked", async () => {
			const user = userEvent.setup();
			renderWithProvider();

			const burgerButton = screen.getByRole("button", {
				name: i18n.t("common.navigation.toggleMenu"),
			});

			// Initially menu should be closed
			expect(screen.queryAllByRole("list")).toHaveLength(1);

			await user.click(burgerButton);

			// After click, menu should be open
			expect(screen.queryAllByRole("list")).toHaveLength(2);
		});

		it("closes mobile menu when burger button is clicked again", async () => {
			const user = userEvent.setup();
			renderWithProvider();

			const burgerButton = screen.getByRole("button", {
				name: i18n.t("common.navigation.toggleMenu"),
			});

			// Open menu
			await user.click(burgerButton);
			expect(screen.queryAllByRole("list")).toHaveLength(2);

			// Close menu
			await user.click(burgerButton);
			expect(screen.queryAllByRole("list")).toHaveLength(1);
		});

	});

	describe("Accessibility", () => {
		it("has accessible aria-label for logout button in desktop menu", () => {
			renderWithProvider({ isAuthenticated: true });

			const desktopNav = screen.getAllByRole("list")[0]!;
			const logoutButton = within(desktopNav).getByRole("button", {
				name: i18n.t("common.navigation.logout"),
			});

			expect(logoutButton).toHaveAttribute("aria-label", i18n.t("common.navigation.logout"));
		});

		it("has accessible aria-label for logout button in mobile menu", async () => {
			const user = userEvent.setup();
			renderWithProvider({ isAuthenticated: true });

			const burgerButton = screen.getByRole("button", {
				name: i18n.t("common.navigation.toggleMenu"),
			});
			await user.click(burgerButton);

			const mobileMenu = screen.getAllByRole("list")[1]!;
			const logoutButton = within(mobileMenu).getByRole("button", {
				name: i18n.t("common.navigation.logout"),
			});

			expect(logoutButton).toHaveAttribute("aria-label", i18n.t("common.navigation.logout"));
		});

		it("has accessible aria-label for burger menu button", () => {
			renderWithProvider();

			const burgerButton = screen.getByRole("button", {
				name: i18n.t("common.navigation.toggleMenu"),
			});

			expect(burgerButton).toHaveAttribute("aria-label", i18n.t("common.navigation.toggleMenu"));
		});
	});
});
