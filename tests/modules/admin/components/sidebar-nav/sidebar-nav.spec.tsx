// @vitest-environment jsdom
import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import { DataStatus, GameKey, type GameKeyType } from "~/libs/enums/enums";
import { i18n } from "~/libs/modules/localization/localization";
import { SidebarNav } from "~/modules/admin/components/sidebar-nav/sidebar-nav";
import { reducer as gamesReducer } from "~/modules/games/games";

type GamesPreload = {
	games: { id: string; key: string }[];
	gamesStatus: (typeof DataStatus)[keyof typeof DataStatus];
};

const buildStore = ({ games, gamesStatus }: GamesPreload): ReturnType<typeof configureStore> =>
	configureStore({
		preloadedState: {
			games: {
				currentGame: null,
				currentGameLevels: null,
				currentGameStatus: DataStatus.IDLE,
				currentLevelsGameId: null,
				games: games.map((entry) => ({
					description: "",
					icon_url: "",
					id: entry.id,
					isActive: true,
					key: entry.key as GameKeyType,
					title: entry.key,
				})),
				gamesStatus,
				levelsStatus: DataStatus.IDLE,
			},
		},
		reducer: { games: gamesReducer },
	});

const renderSidebar = (preload: GamesPreload): ReturnType<typeof configureStore> => {
	const store = buildStore(preload);

	render(
		<Provider store={store}>
			<MemoryRouter>
				<SidebarNav />
			</MemoryRouter>
		</Provider>
	);

	return store;
};

describe("SidebarNav", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders a NavLink with resolved gameId once the matching game is loaded", () => {
		renderSidebar({
			games: [{ id: "42", key: GameKey.FIND_THE_WRONG }],
			gamesStatus: DataStatus.FULFILLED,
		});

		const link = screen.getByRole("link");

		expect(link).toHaveAttribute("href", "/admin/games/42/levels");
	});

	it("renders a disabled placeholder when no matching game is in the slice yet", () => {
		renderSidebar({ games: [], gamesStatus: DataStatus.FULFILLED });

		expect(screen.queryByRole("link")).not.toBeInTheDocument();
	});

	it("dispatches getAllGames when the games slice is IDLE (single fetch owner)", async () => {
		const store = renderSidebar({ games: [], gamesStatus: DataStatus.IDLE });

		await waitFor(() => {
			const state = store.getState() as { games: { gamesStatus: string } };

			expect(state.games.gamesStatus).not.toBe(DataStatus.IDLE);
		});
	});

	it("does not dispatch getAllGames when the slice is already PENDING or FULFILLED", () => {
		const store = buildStore({
			games: [{ id: "42", key: GameKey.FIND_THE_WRONG }],
			gamesStatus: DataStatus.FULFILLED,
		});
		const spy = vi.spyOn(store, "dispatch");

		render(
			<Provider store={store}>
				<MemoryRouter>
					<SidebarNav />
				</MemoryRouter>
			</Provider>
		);

		expect(spy).not.toHaveBeenCalled();

		spy.mockRestore();
	});

	it("renders error fallback with a working retry button on REJECTED", async () => {
		const user = userEvent.setup();
		const store = buildStore({ games: [], gamesStatus: DataStatus.REJECTED });
		const spy = vi.spyOn(store, "dispatch");

		render(
			<Provider store={store}>
				<MemoryRouter>
					<SidebarNav />
				</MemoryRouter>
			</Provider>
		);

		expect(screen.getByText(i18n.t("admin.nav.loadError"))).toBeInTheDocument();
		expect(screen.queryByRole("link")).not.toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: i18n.t("admin.nav.retry") }));

		expect(spy).toHaveBeenCalled();

		spy.mockRestore();
	});
});
