import { describe, expect, it } from "vitest";

import { en } from "~/libs/modules/localization/locales/en";
import { es } from "~/libs/modules/localization/locales/es";
import { uk } from "~/libs/modules/localization/locales/uk";

// Reduces a locale subtree to its structure: object keys, array lengths, and
// "string" leaves. The About copy must mirror the English structure 1:1 (same
// sections, same paragraph/item counts) - a translation silently missing a
// paragraph would not be caught by TypeScript or the page spec (headings only,
// default language only).
const shapeOf = (value: unknown): unknown => {
	if (Array.isArray(value)) {
		return value.map((item) => shapeOf(item));
	}

	if (typeof value === "object" && value !== null) {
		return Object.fromEntries(
			Object.entries(value).map(([key, nested]) => [key, shapeOf(nested)])
		);
	}

	return "string";
};

describe("about locale parity", () => {
	it.each([
		{ locale: "uk", translations: uk },
		{ locale: "es", translations: es },
	])("about $locale mirrors the en structure", ({ translations }) => {
		expect(shapeOf(translations.about)).toEqual(shapeOf(en.about));
	});
});
