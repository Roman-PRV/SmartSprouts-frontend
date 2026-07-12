// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { Footer } from "~/libs/components/footer/footer";
import { AppRoute } from "~/libs/enums/enums";
import { i18n } from "~/libs/modules/localization/localization";

const renderFooter = (): ReturnType<typeof render> =>
	render(
		<MemoryRouter>
			<Footer />
		</MemoryRouter>
	);

describe("Footer", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders the localized copyright with the current year", () => {
		const { getByText } = renderFooter();

		expect(
			getByText(i18n.t("common.footer.copyright", { year: new Date().getFullYear() }))
		).toBeInTheDocument();
	});

	it("links to the privacy policy page", () => {
		const { getByRole } = renderFooter();

		expect(getByRole("link", { name: i18n.t("legal.links.privacy") })).toHaveAttribute(
			"href",
			AppRoute.PRIVACY
		);
	});

	it("links to the terms page", () => {
		const { getByRole } = renderFooter();

		expect(getByRole("link", { name: i18n.t("legal.links.terms") })).toHaveAttribute(
			"href",
			AppRoute.TERMS
		);
	});
});
