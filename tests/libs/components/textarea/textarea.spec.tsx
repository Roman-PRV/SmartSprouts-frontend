// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { Textarea } from "~/libs/components/textarea/textarea";

describe("Textarea", () => {
	afterEach(() => {
		cleanup();
	});

	it("associates the label with the textarea", () => {
		render(<Textarea label="Story" name="story" />);

		expect(screen.getByLabelText("Story")).toBe(screen.getByRole("textbox"));
	});

	it("marks the field as required and reflects it via aria-required", () => {
		render(<Textarea label="Story" name="story" required />);

		const textarea = screen.getByRole("textbox");
		expect(textarea).toBeRequired();
		expect(textarea).toHaveAttribute("aria-required", "true");
	});

	it("keeps aria-invalid false and hides the error region when there is no error", () => {
		render(<Textarea label="Story" name="story" />);

		expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "false");
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});

	it("wires aria-invalid, aria-describedby and an alert to the error message", () => {
		render(<Textarea error="Too long" label="Story" name="story" />);

		const textarea = screen.getByRole("textbox");
		const alert = screen.getByRole("alert");

		expect(textarea).toHaveAttribute("aria-invalid", "true");
		expect(alert).toHaveTextContent("Too long");
		expect(textarea).toHaveAttribute("aria-describedby", alert.id);
	});

	it("forwards its ref so react-hook-form can register it", () => {
		const reference = createRef<HTMLTextAreaElement>();
		render(<Textarea label="Story" name="story" ref={reference} />);

		expect(reference.current).toBe(screen.getByRole("textbox"));
	});
});
