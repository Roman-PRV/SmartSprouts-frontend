// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Modal } from "~/libs/components/modal/modal";

const renderModal = (
	properties?: Partial<React.ComponentProps<typeof Modal>>
): { onClose: ReturnType<typeof vi.fn> } => {
	const onClose = vi.fn();
	render(
		<Modal isOpen onClose={onClose} title="Test modal" {...properties}>
			<p>Modal body</p>
		</Modal>
	);

	return { onClose };
};

describe("Modal", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders the <dialog> in the closed state when isOpen is false", () => {
		render(
			<Modal isOpen={false} onClose={vi.fn()} title="Hidden">
				<p>Content</p>
			</Modal>
		);

		const dialog = screen.getByRole("dialog", { hidden: true });

		expect(dialog).not.toHaveAttribute("open");
	});

	it("renders title and children when open", () => {
		renderModal();

		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(screen.getByText("Test modal")).toBeInTheDocument();
		expect(screen.getByText("Modal body")).toBeInTheDocument();
	});

	it("calls onClose on backdrop click (dialog element itself)", async () => {
		const user = userEvent.setup();
		const { onClose } = renderModal();

		const dialog = screen.getByRole("dialog");
		await user.click(dialog);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("does not call onClose when content inside dialog is clicked", async () => {
		const user = userEvent.setup();
		const { onClose } = renderModal();

		const body = screen.getByText("Modal body");
		await user.click(body);

		expect(onClose).not.toHaveBeenCalled();
	});

	it("calls onClose when the close button is clicked", async () => {
		const user = userEvent.setup();
		const { onClose } = renderModal();

		const closeButton = screen.getByRole("button", { name: /close/i });
		await user.click(closeButton);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("calls onClose on native dialog close event (covers Esc and dialog.close())", () => {
		const { onClose } = renderModal();

		const dialog = screen.getByRole("dialog");
		fireEvent(dialog, new Event("close"));

		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
