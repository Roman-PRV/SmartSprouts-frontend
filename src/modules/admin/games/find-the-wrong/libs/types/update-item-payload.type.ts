import { type Point } from "~/libs/types/types";

import { type LocalizedString } from "./localized-string.type";

type UpdateFindTheWrongAdminItemPayload = {
	explanation?: Partial<LocalizedString>;
	name?: LocalizedString;
	polygon?: Point[];
};

export type { UpdateFindTheWrongAdminItemPayload };
