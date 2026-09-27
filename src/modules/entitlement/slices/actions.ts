import { createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeError } from "~/libs/helpers/helpers";
import { type AsyncThunkConfig } from "~/libs/types/types";

import { type EntitlementResponseDto } from "../libs/types/types";

/**
 * Fetches the account's tier state and both remaining allowances.
 *
 * Dispatched once from the app shell as soon as the session is known — the hook
 * that reads this only selects, so two mounted readers stay one request. Nothing
 * gates the interface on the result: `remaining` is advisory, and the server is
 * the authority on every refusal.
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
