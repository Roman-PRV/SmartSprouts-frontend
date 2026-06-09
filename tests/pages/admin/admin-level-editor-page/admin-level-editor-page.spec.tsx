// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import type * as hooksModule from "~/libs/hooks/hooks";

import { GameKey } from "~/libs/enums/enums";
import { type GameDescriptionDto } from "~/libs/types/types";
import { AdminLevelEditorPage } from "~/pages/admin/admin-level-editor-page/admin-level-editor-page";

type UseGameFetchReturn = {
	currentGame: GameDescriptionDto | null;
	isLoading: boolean;
};

const mockUseGameFetch = vi.fn<(id: string | undefined) => UseGameFetchReturn>();

vi.mock("~/libs/hooks/hooks", async (importOriginal) => {
	const actual = await importOriginal<typeof hooksModule>();

	return {
		...actual,
		useGameFetch: (id: string | undefined) => mockUseGameFetch(id),
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
				<Route
					element={<AdminLevelEditorPage />}
					path="/admin/games/:gameId/levels/:levelId"
				/>
			</Routes>
		</MemoryRouter>
	);

describe("AdminLevelEditorPage", () => {
	afterEach(() => {
		cleanup();
		mockUseGameFetch.mockReset();
	});

	it("renders the FindTheWrong editor when game key is registered and levelId is valid", () => {
		mockUseGameFetch.mockReturnValue({
			currentGame: buildGame(GameKey.FIND_THE_WRONG),
			isLoading: false,
		});

		renderAt("/admin/games/42/levels/7");

		expect(screen.getByRole("heading", { name: /Editor: level 7/i })).toBeInTheDocument();
	});

	it("rejects non-numeric levelId before fetching game", () => {
		mockUseGameFetch.mockReturnValue({
			currentGame: buildGame(GameKey.FIND_THE_WRONG),
			isLoading: false,
		});

		renderAt("/admin/games/42/levels/abc");

		expect(screen.getByText(/Invalid level id/i)).toBeInTheDocument();
	});

	it("shows invalid levelId fallback before any game-load guards", () => {
		mockUseGameFetch.mockReturnValue({ currentGame: null, isLoading: true });

		renderAt("/admin/games/42/levels/abc");

		expect(screen.getByText(/Invalid level id/i)).toBeInTheDocument();
	});

	it("falls back to unsupportedGame for keys without an editor", () => {
		mockUseGameFetch.mockReturnValue({
			currentGame: buildGame(GameKey.TRUE_FALSE_IMAGE),
			isLoading: false,
		});

		renderAt("/admin/games/42/levels/7");

		expect(screen.getByText(/Admin is not available for this game/i)).toBeInTheDocument();
	});
});
