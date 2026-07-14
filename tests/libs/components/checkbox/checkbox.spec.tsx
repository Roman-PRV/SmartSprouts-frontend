// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Checkbox } from "~/libs/components/checkbox/checkbox";

describe("Checkbox", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders an unchecked checkbox associated with its label", () => {
		render(<Checkbox label="Agree to everything" name="agree" />);

		const checkbox = screen.getByLabelText("Agree to everything");

		expect(checkbox).toBeInTheDocument();
		expect(checkbox).toHaveAttribute("type", "checkbox");
		expect(checkbox).not.toBeChecked();
	});

	it("renders a rich ReactNode label", () => {
		render(
			<Checkbox
				label={
					<span>
						Accept the <a href="/terms">Terms</a>
					</span>
				}
				name="agree"
			/>
		);

		expect(screen.getByRole("link", { name: "Terms" })).toBeInTheDocument();
	});

	it("toggles on click and calls onChange", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		render(<Checkbox label="Agree" name="agree" onChange={handleChange} />);

		const checkbox = screen.getByRole("checkbox");
		await user.click(checkbox);

		expect(checkbox).toBeChecked();
		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it("marks the input required and renders the asterisk", () => {
		render(<Checkbox label="Agree" name="agree" required />);

		expect(screen.getByRole("checkbox")).toHaveAttribute("aria-required", "true");
		expect(screen.getByText("*")).toBeInTheDocument();
	});

	it("exposes the error via role alert and aria attributes", () => {
		render(<Checkbox error="You must agree" label="Agree" name="agree" />);

		const checkbox = screen.getByRole("checkbox");
		const error = screen.getByRole("alert");

		expect(error).toHaveTextContent("You must agree");
		expect(checkbox).toHaveAttribute("aria-invalid", "true");
		expect(checkbox).toHaveAttribute("aria-describedby", error.getAttribute("id"));
	});

	it("does not render an alert without an error", () => {
		render(<Checkbox label="Agree" name="agree" />);

		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});

	it("disables the input when disabled", () => {
		render(<Checkbox disabled label="Agree" name="agree" />);

		expect(screen.getByRole("checkbox")).toBeDisabled();
	});
});
