// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";

import { GameCategory } from "~/libs/enums/enums";
import { type ValueOf } from "~/libs/types/types";
import { CategoryFilter } from "~/pages/game-selection-page/category-filter";

const renderFilter = (
	activeCategory?: ValueOf<typeof GameCategory>
): ReturnType<typeof render> =>
	render(
		<MemoryRouter>
			<CategoryFilter activeCategory={activeCategory} />
		</MemoryRouter>
	);

describe("CategoryFilter", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders an All chip plus one chip per category with correct links", () => {
		renderFilter();

		expect(screen.getByRole("link", { name: "All" })).toHaveAttribute("href", "/games");
		expect(screen.getByRole("link", { name: /Math/ })).toHaveAttribute(
			"href",
			"/games?category=math"
		);
		expect(screen.getByRole("link", { name: /Reading/ })).toHaveAttribute(
			"href",
			"/games?category=reading"
		);
		expect(screen.getByRole("link", { name: /Logic/ })).toHaveAttribute(
			"href",
			"/games?category=logic"
		);
	});

	it("marks the active category chip with aria-current", () => {
		renderFilter(GameCategory.READING);

		expect(screen.getByRole("link", { name: /Reading/ })).toHaveAttribute("aria-current", "page");
		expect(screen.getByRole("link", { name: /Math/ })).not.toHaveAttribute("aria-current");
		expect(screen.getByRole("link", { name: "All" })).not.toHaveAttribute("aria-current");
	});

	it("marks the All chip active when no category is selected", () => {
		renderFilter();

		expect(screen.getByRole("link", { name: "All" })).toHaveAttribute("aria-current", "page");
		expect(screen.getByRole("link", { name: /Math/ })).not.toHaveAttribute("aria-current");
	});
});
