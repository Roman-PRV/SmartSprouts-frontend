// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { type ContentSectionData } from "~/libs/components/content-section/libs/types/content-section-data.type";
import { i18n } from "~/libs/modules/localization/localization";
import { PrivacyPolicyPage } from "~/pages/privacy-policy-page/privacy-policy-page";
import { TermsPage } from "~/pages/terms-page/terms-page";

describe.each([
	{ component: PrivacyPolicyPage, documentKey: "privacy" },
	{ component: TermsPage, documentKey: "terms" },
])("legal page $documentKey", ({ component: Page, documentKey }) => {
	const renderPage = (): ReturnType<typeof render> =>
		render(
			<MemoryRouter>
				<Page />
			</MemoryRouter>
		);

	afterEach(() => {
		cleanup();
	});

	it("renders the document title", () => {
		const { getByRole } = renderPage();

		expect(getByRole("heading", { level: 1 })).toHaveTextContent(
			i18n.t(`legal.${documentKey}.title`)
		);
	});

	it("renders the draft banner", () => {
		const { getByText } = renderPage();

		expect(getByText(i18n.t("legal.draftBanner"))).toBeInTheDocument();
	});

	it("renders every section heading", () => {
		const { getAllByRole } = renderPage();

		const sections = i18n.t(`legal.${documentKey}.sections`, {
			returnObjects: true,
		}) as ContentSectionData[];
		const headings = getAllByRole("heading", { level: 2 }).map(
			(heading) => heading.textContent
		);

		expect(headings).toEqual(sections.map((section) => section.heading));
	});
});
