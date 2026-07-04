// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getLabelWithAsterisk } from "@tests/libs/helpers/dom.helpers";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import { i18n } from "~/libs/modules/localization/localization";
import { type Point } from "~/libs/types/types";
import { CreateItemModal } from "~/modules/admin/games/find-the-wrong/components/create-item-modal/create-item-modal";

const samplePolygon: Point[] = [
	[0, 0],
	[1, 0],
	[0.5, 1],
];

const fillNameFields = async (user: ReturnType<typeof userEvent.setup>): Promise<void> => {
	await user.type(
		screen.getByLabelText(
			getLabelWithAsterisk(i18n.t("admin.findTheWrong.item.fields.name.uk"))
		),
		"UA Item"
	);
	await user.type(
		screen.getByLabelText(
			getLabelWithAsterisk(i18n.t("admin.findTheWrong.item.fields.name.en"))
		),
		"EN Item"
	);
	await user.type(
		screen.getByLabelText(
			getLabelWithAsterisk(i18n.t("admin.findTheWrong.item.fields.name.es"))
		),
		"ES Item"
	);
};

describe("CreateItemModal", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders modal title and submit button", () => {
		render(
			<CreateItemModal
				isOpen
				onClose={vi.fn()}
				onSubmit={vi.fn(() => Promise.resolve())}
				polygon={samplePolygon}
			/>
		);

		expect(
			screen.getByRole("heading", { name: i18n.t("admin.findTheWrong.item.create.modalTitle") })
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: i18n.t("admin.findTheWrong.item.create.submit") })
		).toBeInTheDocument();
	});

	it("shows validation errors when submitting with empty name fields", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn(() => Promise.resolve());

		render(
			<CreateItemModal isOpen onClose={vi.fn()} onSubmit={onSubmit} polygon={samplePolygon} />
		);

		await user.click(
			screen.getByRole("button", { name: i18n.t("admin.findTheWrong.item.create.submit") })
		);

		await waitFor(() => {
			expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
		});

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("dispatches onSubmit with polygon and localized name on valid submit", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn<(payload: { name: unknown; polygon: Point[] }) => Promise<void>>(
			() => Promise.resolve()
		);

		render(
			<CreateItemModal isOpen onClose={vi.fn()} onSubmit={onSubmit} polygon={samplePolygon} />
		);

		await fillNameFields(user);

		await user.click(
			screen.getByRole("button", { name: i18n.t("admin.findTheWrong.item.create.submit") })
		);

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledTimes(1);
		});

		const submittedPayload = onSubmit.mock.calls[0]?.[0];

		expect(submittedPayload?.name).toEqual({
			en: "EN Item",
			es: "ES Item",
			uk: "UA Item",
		});
		expect(submittedPayload?.polygon).toEqual(samplePolygon);
	});

	it("calls onClose when the cancel button is clicked", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();

		render(
			<CreateItemModal
				isOpen
				onClose={onClose}
				onSubmit={vi.fn(() => Promise.resolve())}
				polygon={samplePolygon}
			/>
		);

		await user.click(
			screen.getByRole("button", { name: i18n.t("admin.findTheWrong.item.create.cancel") })
		);

		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
