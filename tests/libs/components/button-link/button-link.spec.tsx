// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { ButtonLink } from "~/libs/components/button-link/button-link";

const renderInRouter = (ui: React.ReactElement): ReturnType<typeof render> =>
	render(<MemoryRouter>{ui}</MemoryRouter>);

describe("ButtonLink", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders a single anchor with no nested button", () => {
		renderInRouter(<ButtonLink to="/games">Play now</ButtonLink>);

		const link = screen.getByRole("link", { name: "Play now" });

		expect(link.tagName).toBe("A");
		expect(link).toHaveAttribute("href", "/games");
		expect(link.querySelector("button")).toBeNull();
	});

	it("forwards the destination to the router link", () => {
		renderInRouter(
			<ButtonLink to="/register" variant="secondary">
				Sign up
			</ButtonLink>
		);

		expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute("href", "/register");
	});
});
