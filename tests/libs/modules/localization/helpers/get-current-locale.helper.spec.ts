import { describe, expect, it, vi } from "vitest";

import { Language } from "~/libs/modules/localization/enums/language.enum";
import { getCurrentLocale } from "~/libs/modules/localization/helpers/get-current-locale.helper";
import { i18n } from "~/libs/modules/localization/i18n";

vi.mock("~/libs/modules/localization/i18n", () => ({
	i18n: {
		language: undefined,
	},
}));

describe("getCurrentLocale", () => {
	it("should return the current language from i18n", () => {
		(i18n as { language: string | undefined }).language = "es";
		expect(getCurrentLocale()).toBe("es");
	});

	it("should return default language (en) if i18n.language is undefined", () => {
		(i18n as { language: string | undefined }).language = undefined;
		expect(getCurrentLocale()).toBe(Language.EN);
	});
});
