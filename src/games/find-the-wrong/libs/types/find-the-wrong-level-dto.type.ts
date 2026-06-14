import { type FindTheWrongItemDto } from "./find-the-wrong-item-dto.type";

/**
 * `items_count` is present on the list endpoint (whenCounted); `items` is
 * present on the show endpoint (whenLoaded). The player reads `items`.
 */
type FindTheWrongLevelDto = {
	id: number;
	image_url: null | string;
	items?: FindTheWrongItemDto[];
	items_count?: number;
	title: string;
	title_audio_url: null | string;
};

export { type FindTheWrongLevelDto };
