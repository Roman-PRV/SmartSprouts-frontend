import { type DataStatus } from "~/libs/enums/enums";
import { type ThunkErrorPayload, type ValueOf } from "~/libs/types/types";

import { type EntitlementResponseDto } from "./entitlement-response-dto.type";

type EntitlementState = {
	dataStatus: ValueOf<typeof DataStatus>;
	entitlement: EntitlementResponseDto | null;
	error: null | ThunkErrorPayload;
};

export { type EntitlementState };
