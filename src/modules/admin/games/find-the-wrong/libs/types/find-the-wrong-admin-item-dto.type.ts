import { type Point } from "~/libs/types/types";

import { type LocalizedString } from "./localized-string.type";

type FindTheWrongAdminItemDto = {
	explanation?: Partial<LocalizedString>;
	id: number;
	name: LocalizedString;
	polygon: Point[];
};

export type { FindTheWrongAdminItemDto };
