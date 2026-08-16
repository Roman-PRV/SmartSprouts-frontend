import { setUnauthorizedHandler } from "~/libs/modules/api/api";
import { config } from "~/libs/modules/config/config";

import { createUnauthorizedHandler } from "./create-unauthorized-handler";
import { Store } from "./store.module";

const store = new Store(config);

// Wire the HTTP layer's 401 signal to the store here — at the composition root
// that owns the singleton — instead of inside the Store class.
setUnauthorizedHandler(
	createUnauthorizedHandler({
		dispatch: store.instance.dispatch,
		getIsAuthenticated: () => store.instance.getState().auth.isAuthenticated,
	})
);

export { store };
