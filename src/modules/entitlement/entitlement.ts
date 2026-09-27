import { config } from "~/libs/modules/config/config";
import { http } from "~/libs/modules/http/http";
import { storage } from "~/libs/modules/storage/storage";

import { EntitlementApi } from "./entitlement.api";

const entitlementApi = new EntitlementApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { entitlementApi };
export { useEntitlement } from "./hooks/hooks";
export { getEntitlement } from "./slices/actions";
export { reducer } from "./slices/entitlement.slice";
