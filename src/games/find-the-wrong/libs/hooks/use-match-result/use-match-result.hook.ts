import { useMemo } from "react";

import { type Stroke } from "~/libs/types/types";

import { matchStrokesToItems } from "../../helpers/helpers";
import { type MatchableItem, type MatchResult } from "../../types/types";

/** `items` must be a stable reference between renders; pass a memoized value from the parent. */
const useMatchResult = (strokes: Stroke[], items: MatchableItem[]): MatchResult => {
	return useMemo(() => matchStrokesToItems(strokes, items), [strokes, items]);
};

export { useMatchResult };
