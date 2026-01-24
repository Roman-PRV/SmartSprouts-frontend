/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import "@testing-library/jest-dom/vitest";

import { Dropdown } from "~/libs/components/dropdown/dropdown";

const options = [
	{ label: "Option 1", value: "val1" },
	{ label: "Option 2", value: "val2" },
	{ label: "Option 3", value: "val3" },
];

describe("Dropdown", () => {
	beforeEach(() => {
		window.HTMLElement.prototype.scrollIntoView = vi.fn();
	});

	afterEach(() => {
		cleanup();
	});

	describe("Rendering", () => {
		it("renders with placeholder when no value is selected", () => {
			const onSelect = vi.fn();
			render(
				<Dropdown
					onSelect={onSelect}
					options={options}
					placeholder="Choose item"
					value=""
				/>
			);

			expect(screen.getByText("Choose item")).toBeInTheDocument();
		});

		it("renders selected option label", () => {
			const onSelect = vi.fn();
			render(
				<Dropdown
					onSelect={onSelect}
					options={options}
					value="val2"
				/>
			);

			expect(screen.getByText("Option 2")).toBeInTheDocument();
		});

		it("handles numeric values", () => {
			const numericOptions = [
				{ label: "One", value: 1 },
				{ label: "Two", value: 2 },
			];
			const onSelect = vi.fn();
			render(
				<Dropdown
					onSelect={onSelect}
					options={numericOptions}
					value={2}
				/>
			);

			expect(screen.getByText("Two")).toBeInTheDocument();
		});
	});

	describe("Open/Close Behavior", () => {
		it("opens menu on click", async () => {
			const user = userEvent.setup();
			const onSelect = vi.fn();
			render(
				<Dropdown
					onSelect={onSelect}
					options={options}
					value="val1"
				/>
			);

			const toggle = screen.getByRole("combobox");
			await user.click(toggle);

			expect(screen.getByRole("listbox")).toBeInTheDocument();
			expect(screen.getAllByRole("option")).toHaveLength(3);
		});

		it("closes menu on second click", async () => {
			const user = userEvent.setup();
			const onSelect = vi.fn();
			render(
				<Dropdown
					onSelect={onSelect}
					options={options}
					value="val1"
				/>
			);

			const toggle = screen.getByRole("combobox");
			await user.click(toggle);
			expect(screen.getByRole("listbox")).toBeInTheDocument();

			await user.click(toggle);
			expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
		});

		it("closes menu on click outside", async () => {
			const user = userEvent.setup();
			const onSelect = vi.fn();
			render(
				<div>
					<div data-testid="outside">Outside</div>
					<Dropdown
						onSelect={onSelect}
						options={options}
						value="val1"
					/>
				</div>
			);

			const toggle = screen.getByRole("combobox");
			await user.click(toggle);
			expect(screen.getByRole("listbox")).toBeInTheDocument();

			await user.click(screen.getByTestId("outside"));
			expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
		});
	});

	describe("Selection Behavior", () => {
		it("calls onSelect and closes menu when option is clicked", async () => {
			const user = userEvent.setup();
			const onSelect = vi.fn();
			render(
				<Dropdown
					onSelect={onSelect}
					options={options}
					value="val1"
				/>
			);

			await user.click(screen.getByRole("combobox"));
			const option2 = screen.getByText("Option 2");
			await user.click(option2);

			expect(onSelect).toHaveBeenCalledWith("val2");
			expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
		});
	});

	describe("Keyboard Navigation", () => {
		it("navigates with ArrowDown/ArrowUp", async () => {
			const user = userEvent.setup();
			const onSelect = vi.fn();
			render(
				<Dropdown
					onSelect={onSelect}
					options={options}
					value="val1"
				/>
			);

			const toggle = screen.getByRole("combobox");
			await user.click(toggle);

			// val1 is selected (index 0), so focusedIndex is 0
			expect(toggle).toHaveAttribute("aria-activedescendant", expect.stringContaining("-option-0"));

			await user.keyboard("{ArrowDown}");
			expect(toggle).toHaveAttribute("aria-activedescendant", expect.stringContaining("-option-1"));

			await user.keyboard("{ArrowDown}");
			expect(toggle).toHaveAttribute("aria-activedescendant", expect.stringContaining("-option-2"));

			await user.keyboard("{ArrowUp}");
			expect(toggle).toHaveAttribute("aria-activedescendant", expect.stringContaining("-option-1"));
		});

		it("selects focused option with Enter", async () => {
			const user = userEvent.setup();
			const onSelect = vi.fn();
			render(
				<Dropdown
					onSelect={onSelect}
					options={options}
					value="val1"
				/>
			);

			const toggle = screen.getByRole("combobox");
			await user.click(toggle);
			await user.keyboard("{ArrowDown}"); // Focus Option 2
			await user.keyboard("{Enter}");

			expect(onSelect).toHaveBeenCalledWith("val2");
			expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
		});

		it("closes menu with Escape and focuses toggle", async () => {
			const user = userEvent.setup();
			const onSelect = vi.fn();
			render(
				<Dropdown
					onSelect={onSelect}
					options={options}
					value="val1"
				/>
			);

			const toggle = screen.getByRole("combobox");
			await user.click(toggle);
			expect(screen.getByRole("listbox")).toBeInTheDocument();

			await user.keyboard("{Escape}");
			expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
			expect(toggle).toHaveFocus();
		});

		it("jumps to Home and End", async () => {
			const user = userEvent.setup();
			const onSelect = vi.fn();
			render(
				<Dropdown
					onSelect={onSelect}
					options={options}
					value="val1"
				/>
			);

			const toggle = screen.getByRole("combobox");
			await user.click(toggle);

			await user.keyboard("{End}");
			expect(toggle).toHaveAttribute("aria-activedescendant", expect.stringContaining("-option-2"));

			await user.keyboard("{Home}");
			expect(toggle).toHaveAttribute("aria-activedescendant", expect.stringContaining("-option-0"));
		});

		it("opens menu with ArrowDown/ArrowUp/Space/Enter when closed", async () => {
			const user = userEvent.setup();
			const onSelect = vi.fn();
			render(
				<Dropdown
					onSelect={onSelect}
					options={options}
					value="val1"
				/>
			);

			const toggle = screen.getByRole("combobox");
			toggle.focus();

			await user.keyboard("{ArrowDown}");
			expect(screen.getByRole("listbox")).toBeInTheDocument();
			await user.keyboard("{Escape}");

			await user.keyboard("{ArrowUp}");
			expect(screen.getByRole("listbox")).toBeInTheDocument();
			await user.keyboard("{Escape}");

			await user.keyboard(" ");
			expect(screen.getByRole("listbox")).toBeInTheDocument();
			await user.keyboard("{Escape}");

			await user.keyboard("{Enter}");
			expect(screen.getByRole("listbox")).toBeInTheDocument();
		});
	});

	describe("Accessibility", () => {
		it("has correct roles and attributes", () => {
			const onSelect = vi.fn();
			render(
				<Dropdown
					onSelect={onSelect}
					options={options}
					value="val1"
				/>
			);

			const toggle = screen.getByRole("combobox");
			expect(toggle).toHaveAttribute("aria-haspopup", "listbox");
			expect(toggle).toHaveAttribute("aria-expanded", "false");
			expect(toggle).toHaveAttribute("aria-controls");
		});

		it("updates aria-expanded when menu opens/closes", async () => {
			const user = userEvent.setup();
			const onSelect = vi.fn();
			render(
				<Dropdown
					onSelect={onSelect}
					options={options}
					value="val1"
				/>
			);

			const toggle = screen.getByRole("combobox");
			expect(toggle).toHaveAttribute("aria-expanded", "false");

			await user.click(toggle);
			expect(toggle).toHaveAttribute("aria-expanded", "true");

			await user.click(toggle);
			expect(toggle).toHaveAttribute("aria-expanded", "false");
		});
	});

	describe("Disabled State", () => {
		it("does not open menu when disabled", async () => {
			const user = userEvent.setup();
			const onSelect = vi.fn();
			render(
				<Dropdown
					disabled
					onSelect={onSelect}
					options={options}
					value="val1"
				/>
			);

			const toggle = screen.getByRole("combobox");
			expect(toggle).toBeDisabled();
			expect(toggle).toHaveAttribute("aria-disabled", "true");

			await user.click(toggle);
			expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
		});

		it("does not respond to keyboard when disabled", async () => {
			const user = userEvent.setup();
			const onSelect = vi.fn();
			render(
				<Dropdown
					disabled
					onSelect={onSelect}
					options={options}
					value="val1"
				/>
			);

			const toggle = screen.getByRole("combobox");
			toggle.focus();
			await user.keyboard("{ArrowDown}");
			expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
		});
	});
});
