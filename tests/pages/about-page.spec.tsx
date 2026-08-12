// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { type ContentSectionData } from "~/libs/components/content-section/libs/types/content-section-data.type";
import { i18n } from "~/libs/modules/localization/localization";
import { AboutPage } from "~/pages/about-page/about-page";
import { ABOUT_STACK } from "~/pages/about-page/libs/constants/about-stack.constant";

const renderPage = (): ReturnType<typeof render> =>
	render(
		<MemoryRouter>
			<AboutPage />
		</MemoryRouter>
	);

describe("AboutPage", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders the page title", () => {
		const { getByRole } = renderPage();

		expect(getByRole("heading", { level: 1 })).toHaveTextContent(i18n.t("about.hero.title"));
	});

	it("renders the intro", () => {
		const { getByText } = renderPage();

		expect(getByText(i18n.t("about.hero.intro"))).toBeInTheDocument();
	});

	it("renders every section heading plus the tech-stack heading", () => {
		const { getAllByRole } = renderPage();

		const sections = i18n.t("about.sections", {
			returnObjects: true,
		}) as ContentSectionData[];
		const headings = getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent);

		expect(headings).toEqual([
			...sections.map((section) => section.heading),
			i18n.t("about.stack.heading"),
		]);
	});

	it("renders every tech-stack group with its technologies", () => {
		const { getByText } = renderPage();

		for (const group of ABOUT_STACK) {
			expect(getByText(i18n.t(`about.stack.labels.${group.key}`))).toBeInTheDocument();
			expect(getByText(group.items.join(" · "))).toBeInTheDocument();
		}
	});
});
