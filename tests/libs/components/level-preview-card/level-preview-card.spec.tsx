// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";

import { LevelPreviewCard } from "~/libs/components/level-preview-card/level-preview-card";
import {
	type GameDescriptionDto,
	type LevelDescriptionDto,
	type LevelProgress,
} from "~/libs/types/types";

const MOCK_GAME: GameDescriptionDto = {
	description: "Find the wrong",
	icon_url: "/icon.svg",
	id: "game-1",
	key: "find_the_wrong" as GameDescriptionDto["key"],
	title: "Find the wrong",
};

const buildLevel = (progress: LevelProgress): LevelDescriptionDto => ({
	id: "10",
	image_url: "/level.png",
	progress,
	title: "Level one",
});

const renderCard = (progress: LevelProgress): HTMLElement => {
	const { container } = render(
		<MemoryRouter>
			<LevelPreviewCard game={MOCK_GAME} level={buildLevel(progress)} number={0} />
		</MemoryRouter>
	);

	return container;
};

describe("LevelPreviewCard", () => {
	afterEach(() => {
		cleanup();
	});

	it("frames a mastered level green and exposes a status label", () => {
		const container = renderCard("mastered");

		expect(screen.getByRole("link").className).toContain("card--mastered");
		expect(container.querySelector(".visually-hidden")).not.toBeNull();
	});

	it("frames a not_perfect level yellow and exposes a status label", () => {
		const container = renderCard("not_perfect");

		expect(screen.getByRole("link").className).toContain("card--not-perfect");
		expect(container.querySelector(".visually-hidden")).not.toBeNull();
	});

	it("renders no frame or status label for a not_started level", () => {
		const container = renderCard("not_started");

		const { className } = screen.getByRole("link");

		expect(className).not.toContain("card--mastered");
		expect(className).not.toContain("card--not-perfect");
		expect(container.querySelector(".visually-hidden")).toBeNull();
	});
});
