import { GameCategory } from "~/libs/enums/enums";
import { type ValueOf } from "~/libs/types/types";

type GameCategoryMeta = {
	icon: string;
	titleKey: string;
};

/**
 * Single source of truth for category presentation (icon + i18n title key),
 * shared by the home-page cards and the games-page filter chips/badges. The
 * Record is exhaustive: adding a GameCategory forces a meta entry here, so a new
 * category can never be silently missing an icon or title in either consumer.
 */
const GAME_CATEGORY_META: Record<ValueOf<typeof GameCategory>, GameCategoryMeta> = {
	[GameCategory.LOGIC]: { icon: "🧩", titleKey: "games.categories.logic" },
	[GameCategory.MATH]: { icon: "🧮", titleKey: "games.categories.math" },
	[GameCategory.READING]: { icon: "📚", titleKey: "games.categories.reading" },
};

/** Presentation order for the cards/chips (kept explicit; not alphabetical). */
const GAME_CATEGORY_ORDER: ValueOf<typeof GameCategory>[] = [
	GameCategory.MATH,
	GameCategory.READING,
	GameCategory.LOGIC,
];

export { GAME_CATEGORY_META, GAME_CATEGORY_ORDER };
