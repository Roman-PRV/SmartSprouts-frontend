type MatchedItem = {
	/** Area overlap for circle mode; absent for marker (tap) mode. */
	iou?: number;
	itemId: number;
	stars: number;
};

export type { MatchedItem };
