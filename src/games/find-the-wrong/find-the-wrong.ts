export { DrawingCanvas } from "./components/components";
export {
	CANVAS_HANDLE,
	CANVAS_INSERT_HANDLE,
	CANVAS_PALETTE,
	CANVAS_POLYGON,
} from "./libs/constants/constants";
export { ErrorKind } from "./libs/enums/enums";
export { buildSubmitPayload, matchStrokesToItems } from "./libs/helpers/helpers";
export { useStrokes } from "./libs/hooks/hooks";
export {
	type FeedbackOverlay,
	type FindTheWrongItemDto,
	type FindTheWrongLevelDto,
	type FindTheWrongRevealItemDto,
	type MatchableItem,
	type MatchedItem,
	type MatchResult,
	type SubmitAttemptFoundEntry,
	type SubmitAttemptPayload,
	type SubmitAttemptResponseDto,
} from "./libs/types/types";
