import { type Point } from "~/libs/types/types";

import { type LocalizedString } from "./localized-string.type";

type CreateFindTheWrongAdminItemPayload = {
	explanation?: Partial<LocalizedString>;
	name: LocalizedString;
	polygon: Point[];
};

export type { CreateFindTheWrongAdminItemPayload };
