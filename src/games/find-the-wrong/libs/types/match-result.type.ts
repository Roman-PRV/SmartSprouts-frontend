import { type MatchedItem } from "./matched-item.type";

type MatchResult = {
	found: MatchedItem[];
	missedItemIds: number[];
};

export type { MatchResult };
