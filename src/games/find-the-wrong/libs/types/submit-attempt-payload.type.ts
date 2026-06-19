import { type ValueOf } from "~/libs/types/types";

import { type InteractionMode } from "../enums/enums";

type SubmitAttemptFoundEntry = {
	item_id: number;
	stars: number;
};

type SubmitAttemptPayload = {
	duration_seconds: number;
	found: SubmitAttemptFoundEntry[];
	interaction_mode: ValueOf<typeof InteractionMode>;
	missed_item_ids: number[];
};

export type { SubmitAttemptFoundEntry, SubmitAttemptPayload };
