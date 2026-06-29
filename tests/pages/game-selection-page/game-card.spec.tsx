// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";

import { GameCategory } from "~/libs/enums/enums";
import { type GameDescriptionDto } from "~/libs/types/types";
import { GameCard } from "~/pages/game-selection-page/game-card";

const buildGame = (overrides: Partial<GameDescriptionDto> = {}): GameDescriptionDto => ({
	categories: [GameCategory.MATH, GameCategory.LOGIC],
	description: "Practice your multiplication",
	icon_url: "",
	id: "1",
	isActive: true,
	key: "multiplication_table" as GameDescriptionDto["key"],
	title: "Multiplication",
	...overrides,
});

const renderCard = (game: GameDescriptionDto): ReturnType<typeof render> =>
	render(
		<MemoryRouter>
			<GameCard game={game} />
		</MemoryRouter>
	);

describe("GameCard", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders a badge for each of the game's categories", () => {
		renderCard(buildGame());

		expect(screen.getByText(/Math/)).toBeInTheDocument();
		expect(screen.getByText(/Logic/)).toBeInTheDocument();
	});

	it("renders no category badges when the game has none", () => {
		renderCard(buildGame({ categories: [] }));

		expect(screen.queryByText(/Math/)).not.toBeInTheDocument();
		expect(screen.queryByText(/Logic/)).not.toBeInTheDocument();
	});
});
