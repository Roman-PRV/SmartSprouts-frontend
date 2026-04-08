/**
 * @vitest-environment jsdom
 */
import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import "@testing-library/jest-dom/vitest";

import { Navigation } from "~/libs/components/navigation/navigation";
import { AppRoute, DataStatus } from "~/libs/enums/enums";
import { i18n } from "~/libs/modules/localization/localization";
import { reducer as authReducer } from "~/modules/auth/slices/auth.slice";

type AuthState = {
	dataStatus: (typeof DataStatus)[keyof typeof DataStatus];
	error: null | string;
	isAuthenticated: boolean;
	user: null | { email: string; id: number; name: string };
};

const mockLogout = vi.fn();

const LocationDisplay: React.FC = () => {
	const { pathname } = useLocation();
	return <div data-testid="location">{pathname}</div>;
};

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

const renderWithProvider = (
	initialAuthState?: Partial<AuthState>,
	initialEntries: string[] = [AppRoute.ROOT]
) => {
	const store = createMockStore(initialAuthState);
	return {
		...render(
			<Provider store={store}>
				<MemoryRouter initialEntries={initialEntries}>
					<Navigation />
					<LocationDisplay />
				</MemoryRouter>
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
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
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
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			await user.click(burgerButton);

			const mobileMenu = screen.getByRole("menu", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			const logoutButton = within(mobileMenu).getByRole("menuitem", {
				name: i18n.t("common.navigation.logout"),
			});

			expect(logoutButton).toBeInTheDocument();
		});

		it("does not show logout button in mobile menu when not authenticated", async () => {
			const user = userEvent.setup();
			renderWithProvider({ isAuthenticated: false });

			const burgerButton = screen.getByRole("button", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			await user.click(burgerButton);

			const mobileMenu = screen.getByRole("menu", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			const logoutButton = within(mobileMenu).queryByRole("menuitem", {
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
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			await user.click(burgerButton);

			const mobileMenu = screen.getByRole("menu", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			const logoutButton = within(mobileMenu).getByRole("menuitem", {
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
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			await user.click(burgerButton);

			// Menu should be open
			let mobileMenu: HTMLElement | null = screen.queryByRole("menu", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			expect(mobileMenu).toBeInTheDocument();

			const logoutButton = within(mobileMenu!).getByRole("menuitem", {
				name: i18n.t("common.navigation.logout"),
			});
			await user.click(logoutButton);

			// Menu should be closed after logout
			mobileMenu = screen.queryByRole("menu", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			expect(mobileMenu).toBeNull();
		});
	});

	describe("Mobile Menu Interaction", () => {
		it("opens mobile menu when burger button is clicked", async () => {
			const user = userEvent.setup();
			renderWithProvider();

			const burgerButton = screen.getByRole("button", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});

			// Initially menu should be closed
			expect(screen.queryByRole("menu", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			})).toBeNull();

			await user.click(burgerButton);

			// After click, menu should be open
			expect(screen.getByRole("menu", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			})).toBeInTheDocument();
		});

		it("closes mobile menu when burger button is clicked again", async () => {
			const user = userEvent.setup();
			renderWithProvider();

			const burgerButton = screen.getByRole("button", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});

			// Open menu
			await user.click(burgerButton);
			expect(screen.getByRole("menu", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			})).toBeInTheDocument();

			// Close menu
			await user.click(burgerButton);
			expect(screen.queryByRole("menu", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			})).toBeNull();
		});

	});

	describe("Mobile Menu Navigation", () => {
		it("navigates to Home route when Home is clicked in mobile menu", async () => {
			const user = userEvent.setup();
			renderWithProvider();

			const burgerButton = screen.getByRole("button", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			await user.click(burgerButton);

			const mobileMenu = screen.getByRole("menu", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			const homeOption = within(mobileMenu).getByRole("menuitem", {
				name: i18n.t("common.navigation.home"),
			});

			await user.click(homeOption);
			expect(screen.getByTestId("location")).toHaveTextContent(AppRoute.ROOT);
		});

		it("navigates to Games route when Games is clicked in mobile menu", async () => {
			const user = userEvent.setup();
			renderWithProvider();

			const burgerButton = screen.getByRole("button", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			await user.click(burgerButton);

			const mobileMenu = screen.getByRole("menu", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			const gamesOption = within(mobileMenu).getByRole("menuitem", {
				name: i18n.t("common.navigation.games"),
			});

			await user.click(gamesOption);
			expect(screen.getByTestId("location")).toHaveTextContent(AppRoute.GAMES);

			// Verify that the burger button label updates after navigation
			const burgerButtonAfter = screen.getByRole("button", {
				name: new RegExp(i18n.t("common.navigation.games")),
			});
			expect(burgerButtonAfter).toBeInTheDocument();
		});

		it("navigates to Profile route when Profile is clicked in mobile menu", async () => {
			const user = userEvent.setup();
			renderWithProvider();

			const burgerButton = screen.getByRole("button", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			await user.click(burgerButton);

			const mobileMenu = screen.getByRole("menu", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			const profileButton = within(mobileMenu).getByRole("menuitem", {
				name: i18n.t("common.navigation.profile"),
			});

			await user.click(profileButton);
			expect(screen.getByTestId("location")).toHaveTextContent(AppRoute.PROFILE);

			// Verify that the burger button label updates after navigation
			const burgerButtonAfter = screen.getByRole("button", {
				name: new RegExp(i18n.t("common.navigation.profile")),
			});
			expect(burgerButtonAfter).toBeInTheDocument();
		});

		it("closes mobile menu when a navigation option is clicked", async () => {
			const user = userEvent.setup();
			renderWithProvider();

			const burgerButton = screen.getByRole("button", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			await user.click(burgerButton);

			// Menu should be open
			let mobileMenu: HTMLElement | null = screen.queryByRole("menu", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			expect(mobileMenu).toBeInTheDocument();

			const gamesOption = within(mobileMenu!).getByRole("menuitem", {
				name: i18n.t("common.navigation.games"),
			});
			await user.click(gamesOption);

			// Menu should be closed after navigation
			mobileMenu = screen.queryByRole("menu", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			expect(mobileMenu).toBeNull();
		});

		it("correctly identifies active mobile menu item for nested routes", async () => {
			const user = userEvent.setup();
			const nestedGamePath = "/games/123";

			renderWithProvider({}, [nestedGamePath]);

			const burgerButton = screen.getByRole("button", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.games")}`,
			});
			await user.click(burgerButton);

			const mobileMenu = screen.getByRole("menu", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.games")}`,
			});

			const gamesOption = within(mobileMenu).getByRole("menuitem", {
				name: i18n.t("common.navigation.games"),
			});

			expect(gamesOption).toBeInTheDocument();
		});

		it("displays default placeholder in mobile menu for unknown routes", () => {
			const unknownPath = "/unknown";
			renderWithProvider({}, [unknownPath]);

			const burgerButton = screen.getByRole("button", {
				name: new RegExp(`current: Select option`),
			});

			expect(burgerButton).toBeInTheDocument();
		});

		it("does not incorrectly identify active mobile menu item for partial path matches", () => {
			const partialMatchPath = "/gamesabc";
			renderWithProvider({}, [partialMatchPath]);

			// Since /gamesabc doesn't match /games or any other route exactly or as a sub-path, 
			// it should fall back to the placeholder
			const burgerButton = screen.getByRole("button", {
				name: new RegExp(`current: Select option`),
			});

			expect(burgerButton).toBeInTheDocument();
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
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			await user.click(burgerButton);

			const mobileMenu = screen.getByRole("menu", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			const logoutButton = within(mobileMenu).getByRole("menuitem", {
				name: i18n.t("common.navigation.logout"),
			});

			expect(logoutButton).toHaveAttribute("aria-label", i18n.t("common.navigation.logout"));
		});

		it("has accessible aria-label for burger menu button", () => {
			renderWithProvider();

			const burgerButton = screen.getByRole("button", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			expect(burgerButton).toHaveAttribute("aria-label", `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`);
		});

		it("has correct aria-expanded attribute on burger menu button", async () => {
			const user = userEvent.setup();
			renderWithProvider();

			const burgerButton = screen.getByRole("button", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});

			// Initially closed
			expect(burgerButton).toHaveAttribute("aria-expanded", "false");

			// Open menu
			await user.click(burgerButton);
			expect(burgerButton).toHaveAttribute("aria-expanded", "true");

			// Close menu
			await user.click(burgerButton);
			expect(burgerButton).toHaveAttribute("aria-expanded", "false");
		});

		it("has correct aria-controls and id on burger menu button", () => {
			renderWithProvider();

			const burgerButton = screen.getByRole("button", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});

			expect(burgerButton).toHaveAttribute("aria-controls", "mobile-menu");
			expect(burgerButton).toHaveAttribute("id", "burger-button");
		});

		it("has correct accessibility attributes on mobile menu when open", async () => {
			const user = userEvent.setup();
			renderWithProvider();

			const burgerButton = screen.getByRole("button", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});

			await user.click(burgerButton);

			const mobileMenu = screen.queryByRole("menu", {
				name: `${i18n.t("common.navigation.toggleMenu")}, current: ${i18n.t("common.navigation.home")}`,
			});
			expect(mobileMenu).toHaveAttribute("id", "mobile-menu");
			expect(mobileMenu).toHaveAttribute("aria-labelledby", "burger-button");
		});
	});
});
