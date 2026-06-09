type SubmitAttemptFoundEntry = {
	item_id: number;
	stars: number;
};

type SubmitAttemptPayload = {
	duration_seconds: number;
	found: SubmitAttemptFoundEntry[];
	missed_item_ids: number[];
};

export type { SubmitAttemptFoundEntry, SubmitAttemptPayload };
