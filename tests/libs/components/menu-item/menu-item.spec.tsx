// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import { MenuItem } from "~/libs/components/menu-item/menu-item";

describe("MenuItem", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders a link pointing at `to` when given a route", () => {
		render(
			<MemoryRouter>
				<MenuItem to="/admin">Admin panel</MenuItem>
			</MemoryRouter>
		);

		const link = screen.getByRole("link", { name: "Admin panel" });

		expect(link).toHaveAttribute("href", "/admin");
	});

	it("marks the exact route active with aria-current", () => {
		render(
			<MemoryRouter initialEntries={["/games"]}>
				<MenuItem to="/games">Games</MenuItem>
			</MemoryRouter>
		);

		expect(screen.getByRole("link", { name: "Games" })).toHaveAttribute("aria-current", "page");
	});

	it("does not mark a nested route as exact-active", () => {
		render(
			<MemoryRouter initialEntries={["/games/123"]}>
				<MenuItem to="/games">Games</MenuItem>
			</MemoryRouter>
		);

		expect(screen.getByRole("link", { name: "Games" })).not.toHaveAttribute("aria-current");
	});

	it("renders a button and calls onClick when given a handler", async () => {
		const handleClick = vi.fn();

		render(
			<MenuItem ariaLabel="Logout" onClick={handleClick}>
				Logout
			</MenuItem>
		);

		const button = screen.getByRole("button", { name: "Logout" });
		await userEvent.click(button);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});
