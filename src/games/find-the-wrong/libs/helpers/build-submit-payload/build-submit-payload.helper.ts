import {
	type MatchedItem,
	type MatchResult,
	type SubmitAttemptFoundEntry,
	type SubmitAttemptPayload,
} from "../../types/types";

const toFoundEntry = ({ itemId, stars }: MatchedItem): SubmitAttemptFoundEntry => ({
	item_id: itemId,
	stars,
});

const buildSubmitPayload = (
	result: MatchResult,
	durationSeconds: number
): SubmitAttemptPayload => ({
	duration_seconds: durationSeconds,
	found: result.found.map((entry) => toFoundEntry(entry)),
	missed_item_ids: [...result.missedItemIds],
});

export { buildSubmitPayload };
