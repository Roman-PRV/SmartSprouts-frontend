import { createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeError } from "~/libs/helpers/helpers";
import { type AsyncThunkConfig } from "~/libs/types/types";

import { type EntitlementResponseDto } from "../libs/types/types";

/**
 * Fetches the account's tier state and both remaining allowances.
 *
 * Dispatched once the session is known and again after anything that moves a
 * counter or the tier. Nothing gates the interface on the result: `remaining`
 * is advisory, and the server is the authority on every refusal.
 */
const getEntitlement = createAsyncThunk<EntitlementResponseDto, undefined, AsyncThunkConfig>(
	"entitlement/getEntitlement",
	async (_payload, { extra, rejectWithValue }) => {
		const { entitlementApi } = extra;

		try {
			return await entitlementApi.getEntitlement();
		} catch (error) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

export { getEntitlement };
