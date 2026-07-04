// @vitest-environment jsdom
import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getLabelWithAsterisk } from "@tests/libs/helpers/dom.helpers";
import "@testing-library/jest-dom/vitest";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DataStatus } from "~/libs/enums/enums";
import { i18n } from "~/libs/modules/localization/localization";
import { type GameDescriptionDto } from "~/libs/types/types";
import { reducer as findTheWrongAdminReducer } from "~/modules/admin/games/find-the-wrong/api/slices/find-the-wrong-admin.slice";
import { CreateLevelModal } from "~/modules/admin/games/find-the-wrong/components/create-level-modal/create-level-modal";
import { type FindTheWrongAdminLevelDto } from "~/modules/admin/games/find-the-wrong/libs/types/types";

const game: GameDescriptionDto = {
	description: "",
	icon_url: "",
	id: "42",
	isActive: true,
	key: "find_the_wrong" as GameDescriptionDto["key"],
	title: "Find the wrong",
};

type Setup = {
	createLevel: ReturnType<typeof vi.fn>;
	onClose: ReturnType<typeof vi.fn>;
};

const setup = (createdLevel?: FindTheWrongAdminLevelDto): Setup => {
	const createLevel = vi.fn().mockResolvedValue(
		createdLevel ?? {
			id: 99,
			image_url: null,
			items_count: 0,
			title: { en: "EN", es: "ES", uk: "UK" },
		}
	);
	const mockApi = { createLevel };
	const onClose = vi.fn();

	const store = configureStore({
		middleware: (getDefault) =>
			getDefault({ thunk: { extraArgument: { findTheWrongAdminApi: mockApi } } }),
		preloadedState: {
			findTheWrongAdmin: {
				currentLevel: null,
				levelError: null,
				levelsList: [],
				listError: null,
				listStatus: DataStatus.IDLE,
				loadStatus: DataStatus.IDLE,
			},
		},
		reducer: { findTheWrongAdmin: findTheWrongAdminReducer },
	});

	render(
		<Provider store={store}>
			<MemoryRouter>
				<CreateLevelModal game={game} isOpen onClose={onClose} />
			</MemoryRouter>
		</Provider>
	);

	return { createLevel, onClose };
};

const fillTitles = async (user: ReturnType<typeof userEvent.setup>): Promise<void> => {
	await user.type(
		screen.getByLabelText(
			getLabelWithAsterisk(i18n.t("admin.findTheWrong.create.fields.title.uk"))
		),
		"UA Title"
	);
	await user.type(
		screen.getByLabelText(
			getLabelWithAsterisk(i18n.t("admin.findTheWrong.create.fields.title.en"))
		),
		"EN Title"
	);
	await user.type(
		screen.getByLabelText(
			getLabelWithAsterisk(i18n.t("admin.findTheWrong.create.fields.title.es"))
		),
		"ES Title"
	);
};

describe("CreateLevelModal", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders modal title and submit button", () => {
		setup();

		expect(
			screen.getByRole("heading", { name: i18n.t("admin.findTheWrong.create.modalTitle") })
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: i18n.t("admin.findTheWrong.create.submit") })
		).toBeInTheDocument();
	});

	it("shows validation errors when submitting an empty form", async () => {
		const user = userEvent.setup();
		const { createLevel } = setup();

		await user.click(
			screen.getByRole("button", { name: i18n.t("admin.findTheWrong.create.submit") })
		);

		await waitFor(() => {
			expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
		});

		expect(createLevel).not.toHaveBeenCalled();
	});

	it("dispatches createLevel with FormData when submission is valid", async () => {
		const user = userEvent.setup();
		const { createLevel } = setup();

		await fillTitles(user);

		const file = new File(["x"], "level.png", { type: "image/png" });
		const fileInput = screen.getByLabelText(
			getLabelWithAsterisk(i18n.t("admin.findTheWrong.create.fields.image.label"))
		);
		await user.upload(fileInput, file);

		await user.click(
			screen.getByRole("button", { name: i18n.t("admin.findTheWrong.create.submit") })
		);

		await waitFor(() => {
			expect(createLevel).toHaveBeenCalledTimes(1);
		});

		const [, submittedFormData] = createLevel.mock.calls[0] as [string, FormData];
		expect(submittedFormData.get("title[uk]")).toBe("UA Title");
		expect(submittedFormData.get("title[en]")).toBe("EN Title");
		expect(submittedFormData.get("title[es]")).toBe("ES Title");
		expect(submittedFormData.get("image")).toBeInstanceOf(File);
		expect(submittedFormData.get("_method")).toBeNull();
	});

	it("calls onClose when the cancel button is clicked", async () => {
		const user = userEvent.setup();
		const { onClose } = setup();

		await user.click(
			screen.getByRole("button", { name: i18n.t("admin.findTheWrong.create.cancel") })
		);

		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
