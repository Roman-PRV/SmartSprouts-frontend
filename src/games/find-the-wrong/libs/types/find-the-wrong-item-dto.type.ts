import { type Point } from "~/libs/types/types";

/**
 * Public-facing polygon item (no reveal-after-submit fields). `polygon` is the
 * raw ring of normalized [x, y] vertices the BE stores — it maps directly to
 * the match engine's `MatchableItem`, not to the canvas `Polygon` object.
 */
type FindTheWrongItemDto = {
	id: number;
	name: string;
	name_audio_url: null | string;
	polygon: Point[];
};

export { type FindTheWrongItemDto };
