import { type FindTheWrongAdminItemDto } from "./find-the-wrong-admin-item-dto.type";
import { type LocalizedString } from "./localized-string.type";

type FindTheWrongAdminLevelDto = {
	id: number;
	image_url: null | string;
	items?: FindTheWrongAdminItemDto[];
	items_count: number;
	title: LocalizedString;
	title_audio_url?: Partial<LocalizedString>;
};

export type { FindTheWrongAdminLevelDto };
