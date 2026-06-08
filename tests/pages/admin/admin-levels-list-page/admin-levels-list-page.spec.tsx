// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import type * as hooksModule from "~/libs/hooks/hooks";

import { GameKey } from "~/libs/enums/enums";
import { type GameDescriptionDto } from "~/libs/types/types";
import { AdminLevelsListPage } from "~/pages/admin/admin-levels-list-page/admin-levels-list-page";

type UseGameFetchReturn = {
	currentGame: GameDescriptionDto | null;
	isLoading: boolean;
};

const mockUseGameFetch = vi.fn<() => UseGameFetchReturn>();

vi.mock("~/libs/hooks/hooks", async (importOriginal) => {
	const actual = await importOriginal<typeof hooksModule>();

	return {
		...actual,
		useGameFetch: () => mockUseGameFetch(),
	};
});

const buildGame = (key: string): GameDescriptionDto => ({
	description: "Find the wrong description",
	icon_url: "",
	id: "42",
	isActive: true,
	key: key as GameDescriptionDto["key"],
	title: "Find the wrong",
});

const renderAt = (path: string): ReturnType<typeof render> =>
	render(
		<MemoryRouter initialEntries={[path]}>
			<Routes>
				<Route element={<AdminLevelsListPage />} path="/admin/games/:gameId/levels" />
			</Routes>
		</MemoryRouter>
	);

describe("AdminLevelsListPage", () => {
	afterEach(() => {
		cleanup();
		mockUseGameFetch.mockReset();
	});

	it("renders the FindTheWrong section when game key is registered", () => {
		mockUseGameFetch.mockReturnValue({
			currentGame: buildGame(GameKey.FIND_THE_WRONG),
			isLoading: false,
		});

		renderAt("/admin/games/42/levels");

		expect(screen.getByRole("heading", { name: /Find the wrong/i })).toBeInTheDocument();
	});

	it("falls back to unsupportedGame message when game key has no section", () => {
		mockUseGameFetch.mockReturnValue({
			currentGame: buildGame(GameKey.TRUE_FALSE_TEXT),
			isLoading: false,
		});

		renderAt("/admin/games/42/levels");

		expect(screen.getByText(/Admin is not available for this game/i)).toBeInTheDocument();
	});

	it("falls back to gameNotFound message when game cannot be resolved", () => {
		mockUseGameFetch.mockReturnValue({ currentGame: null, isLoading: false });

		renderAt("/admin/games/999/levels");

		expect(screen.getByText(/Game not found/i)).toBeInTheDocument();
	});
});
