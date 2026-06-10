import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { AVAILABLE_LANGUAGES } from "~/libs/modules/localization/localization";

import { type LocalizedString } from "../types/types";

type HttpMethodOverride = "PATCH" | "POST";

type LevelFormInput = {
	image?: File;
	title: LocalizedString;
};

const buildLevelFormData = (input: LevelFormInput, method: HttpMethodOverride): FormData => {
	const formData = new FormData();

	if (method === HTTPMethod.PATCH) {
		formData.append("_method", HTTPMethod.PATCH);
	}

	for (const lang of AVAILABLE_LANGUAGES) {
		formData.append(`title[${lang}]`, input.title[lang]);
	}

	if (input.image) {
		formData.append("image", input.image);
	}

	return formData;
};

export { buildLevelFormData };
