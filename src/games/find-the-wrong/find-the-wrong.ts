export { DrawingCanvas } from "./components/components";
export {
	CANVAS_HANDLE,
	CANVAS_INSERT_HANDLE,
	CANVAS_PALETTE,
	CANVAS_POLYGON,
} from "./libs/constants/constants";
export { buildSubmitPayload } from "./libs/helpers/helpers";
export { useMatchResult, useStrokes } from "./libs/hooks/hooks";
export {
	type FeedbackOverlay,
	type MatchableItem,
	type MatchedItem,
	type MatchResult,
	type SubmitAttemptFoundEntry,
	type SubmitAttemptPayload,
} from "./libs/types/types";
