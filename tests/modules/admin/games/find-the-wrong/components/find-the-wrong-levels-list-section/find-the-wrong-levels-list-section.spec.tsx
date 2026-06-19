// @vitest-environment jsdom
import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { i18n } from "~/libs/modules/localization/localization";
import { type GameDescriptionDto } from "~/libs/types/types";
import { reducer as findTheWrongAdminReducer } from "~/modules/admin/games/find-the-wrong/api/slices/find-the-wrong-admin.slice";
import { FindTheWrongLevelsListSection } from "~/modules/admin/games/find-the-wrong/components/find-the-wrong-levels-list-section/find-the-wrong-levels-list-section";
import { type FindTheWrongAdminLevelDto } from "~/modules/admin/games/find-the-wrong/libs/types/types";

const buildGame = (): GameDescriptionDto => ({
	description: "",
	icon_url: "",
	id: "42",
	isActive: true,
	key: "find_the_wrong" as GameDescriptionDto["key"],
	title: "Find the wrong",
});

const buildLevel = (id: number): FindTheWrongAdminLevelDto => ({
	id,
	image_url: null,
	items_count: 3,
	title: { en: `EN-${String(id)}`, es: `ES-${String(id)}`, uk: `UK-${String(id)}` },
});

type RenderOptions = {
	deleteLevel?: ReturnType<typeof vi.fn>;
	getLevelsListReturn: FindTheWrongAdminLevelDto[];
};

const renderSection = ({ deleteLevel, getLevelsListReturn }: RenderOptions): void => {
	const mockApi = {
		createLevel: vi.fn(),
		deleteLevel: deleteLevel ?? vi.fn(() => Promise.resolve()),
		getLevelsList: vi.fn().mockResolvedValue(getLevelsListReturn),
	};

	const store = configureStore({
		middleware: (getDefault) =>
			getDefault({ thunk: { extraArgument: { findTheWrongAdminApi: mockApi } } }),
		reducer: { findTheWrongAdmin: findTheWrongAdminReducer },
	});

	render(
		<Provider store={store}>
			<MemoryRouter>
				<FindTheWrongLevelsListSection game={buildGame()} />
			</MemoryRouter>
		</Provider>
	);
};

describe("FindTheWrongLevelsListSection", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders empty-state message after fulfilled with no levels", async () => {
		renderSection({ getLevelsListReturn: [] });

		expect(await screen.findByText(i18n.t("admin.findTheWrong.emptyList"))).toBeInTheDocument();
	});

	it("renders one row per level after fulfilled, localized for current locale", async () => {
		renderSection({ getLevelsListReturn: [buildLevel(1), buildLevel(2)] });

		expect(await screen.findByText("EN-1")).toBeInTheDocument();
		expect(screen.getByText("EN-2")).toBeInTheDocument();
	});

	it("opens delete confirmation when Delete is clicked", async () => {
		const user = userEvent.setup();
		renderSection({ getLevelsListReturn: [buildLevel(1)] });

		const deleteButton = await screen.findByRole("button", {
			name: i18n.t("admin.findTheWrong.list.actions.delete"),
		});
		await user.click(deleteButton);

		expect(
			screen.getByText(i18n.t("admin.findTheWrong.delete.confirmTitle"))
		).toBeInTheDocument();
	});

	it("renders the Create level toolbar button immediately", () => {
		renderSection({ getLevelsListReturn: [] });

		expect(
			screen.getByRole("button", { name: i18n.t("admin.findTheWrong.list.create") })
		).toBeInTheDocument();
	});
});
