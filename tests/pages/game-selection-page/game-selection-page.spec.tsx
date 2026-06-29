// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import type * as hooksModule from "~/libs/hooks/hooks";

import { GameSelectionPage } from "~/pages/game-selection-page/game-selection-page";

const getAllGamesMock = vi.fn((category?: string) => ({ category, type: "games/get-all-games" }));
const dispatchMock = vi.fn();

vi.mock("~/pages/game-selection-page/game-selection-list", () => ({
	GameSelectionList: () => <div>games list</div>,
}));

vi.mock("~/modules/games/games", () => ({
	actions: { getAllGames: (category?: string) => getAllGamesMock(category) },
}));

vi.mock("~/libs/hooks/hooks", async (importOriginal) => {
	const actual = await importOriginal<typeof hooksModule>();

	return {
		...actual,
		useAppDispatch: () => dispatchMock,
		useLanguageSync: () => {},
	};
});

const renderAt = (path: string): ReturnType<typeof render> =>
	render(
		<MemoryRouter initialEntries={[path]}>
			<GameSelectionPage />
		</MemoryRouter>
	);

describe("GameSelectionPage", () => {
	afterEach(() => {
		cleanup();
		getAllGamesMock.mockClear();
		dispatchMock.mockClear();
	});

	it("fetches games for a valid category from the URL", () => {
		renderAt("/games?category=reading");

		expect(getAllGamesMock).toHaveBeenCalledWith("reading");
		expect(dispatchMock).toHaveBeenCalledWith({
			category: "reading",
			type: "games/get-all-games",
		});
	});

	it("fetches all games when the category is invalid", () => {
		renderAt("/games?category=not-a-category");

		expect(getAllGamesMock).toHaveBeenCalledWith(undefined);
	});

	it("fetches all games when no category is present", () => {
		renderAt("/games");

		expect(getAllGamesMock).toHaveBeenCalledWith(undefined);
	});
});
