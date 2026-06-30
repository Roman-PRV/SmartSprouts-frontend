import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { AVAILABLE_LANGUAGES } from "~/libs/modules/localization/localization";

import { type LocalizedString } from "../types/types";

type HttpMethodOverride = "PATCH" | "POST";

type LevelFormInput = {
	image?: File | undefined;
	text?: LocalizedString | undefined;
	title: LocalizedString;
};

/**
 * Build the multipart level payload shared by both true/false games. `title`
 * is always sent; `text` only when present (the text game). PATCH is spoofed
 * via _method on a POST so the uploaded file survives Laravel's form-method
 * override.
 */
const buildTrueFalseLevelFormData = (
	input: LevelFormInput,
	method: HttpMethodOverride
): FormData => {
	const formData = new FormData();

	if (method === HTTPMethod.PATCH) {
		formData.append("_method", HTTPMethod.PATCH);
	}

	for (const lang of AVAILABLE_LANGUAGES) {
		formData.append(`title[${lang}]`, input.title[lang]);
	}

	if (input.text) {
		for (const lang of AVAILABLE_LANGUAGES) {
			formData.append(`text[${lang}]`, input.text[lang]);
		}
	}

	if (input.image) {
		formData.append("image", input.image);
	}

	return formData;
};

export { buildTrueFalseLevelFormData };
