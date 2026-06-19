export { DrawingCanvas } from "./components/components";
export {
	CANVAS_HANDLE,
	CANVAS_INSERT_HANDLE,
	CANVAS_PALETTE,
	CANVAS_POLYGON,
} from "./libs/constants/constants";
export { ErrorKind, InteractionMode } from "./libs/enums/enums";
export {
	buildSubmitPayload,
	INTERACTION_MODES,
	isClosedLoop,
	isInteractionMode,
	matchStrokesToItems,
	matchTapsToItems,
} from "./libs/helpers/helpers";
export { useMarkers, useStrokes } from "./libs/hooks/hooks";
export {
	type FeedbackOverlay,
	type FindTheWrongItemDto,
	type FindTheWrongLevelDto,
	type FindTheWrongRevealItemDto,
	type Marker,
	type MatchableItem,
	type MatchedItem,
	type MatchResult,
	type SubmitAttemptFoundEntry,
	type SubmitAttemptPayload,
	type SubmitAttemptResponseDto,
} from "./libs/types/types";
