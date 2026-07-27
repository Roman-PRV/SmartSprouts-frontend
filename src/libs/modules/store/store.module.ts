import {
	combineReducers,
	type ThunkMiddleware,
	type Tuple,
	type UnknownAction,
} from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

import {
	arithmeticGameApi,
	reducer as arithmeticGameReducer,
} from "~/games/arithmetic/api/arithmetic-game";
import {
	findTheWrongGameApi,
	reducer as findTheWrongGameReducer,
} from "~/games/find-the-wrong/api/find-the-wrong-game";
import {
	trueFalseGameApi,
	reducer as trueFalseGameReducer,
} from "~/games/true-false-game/api/true-false-game";
import { AppEnvironment } from "~/libs/enums/enums";
import { setUnauthorizedHandler } from "~/libs/modules/api/api";
import { type Config } from "~/libs/modules/config/config";
import { storage, StorageKey } from "~/libs/modules/storage/storage";
import {
	findTheWrongAdminApi,
	reducer as findTheWrongAdminReducer,
} from "~/modules/admin/games/find-the-wrong/find-the-wrong-admin";
import {
	trueFalseAdminApi,
	reducer as trueFalseAdminReducer,
} from "~/modules/admin/games/true-false/true-false-admin";
import { authApi, reducer as authReducer, logout, sessionExpired } from "~/modules/auth/auth";
import { gamesApi, reducer as gamesReducer } from "~/modules/games/games";
import { profileApi, reducer as profileReducer } from "~/modules/profile/profile";

type ExtraArguments = {
	arithmeticGameApi: typeof arithmeticGameApi;
	authApi: typeof authApi;
	findTheWrongAdminApi: typeof findTheWrongAdminApi;
	findTheWrongGameApi: typeof findTheWrongGameApi;
	gamesApi: typeof gamesApi;
	profileApi: typeof profileApi;
	storage: typeof storage;
	trueFalseAdminApi: typeof trueFalseAdminApi;
	trueFalseGameApi: typeof trueFalseGameApi;
};

type RootReducer = {
	arithmeticLevels: ReturnType<typeof arithmeticGameReducer>;
	auth: ReturnType<typeof authReducer>;
	findTheWrongAdmin: ReturnType<typeof findTheWrongAdminReducer>;
	findTheWrongLevels: ReturnType<typeof findTheWrongGameReducer>;
	games: ReturnType<typeof gamesReducer>;
	profile: ReturnType<typeof profileReducer>;
	trueFalseAdmin: ReturnType<typeof trueFalseAdminReducer>;
	trueFalseLevels: ReturnType<typeof trueFalseGameReducer>;
};

const rootReducer = combineReducers({
	arithmeticLevels: arithmeticGameReducer,
	auth: authReducer,
	findTheWrongAdmin: findTheWrongAdminReducer,
	findTheWrongLevels: findTheWrongGameReducer,
	games: gamesReducer,
	profile: profileReducer,
	trueFalseAdmin: trueFalseAdminReducer,
	trueFalseLevels: trueFalseGameReducer,
});

const resettableRootReducer = (
	state: RootReducer | undefined,
	action: UnknownAction
): RootReducer => {
	if (action.type === logout.fulfilled.type || action.type === sessionExpired.type) {
		return rootReducer(undefined, action);
	}

	return rootReducer(state, action);
};

class Store {
	public instance: ReturnType<
		typeof configureStore<
			RootReducer,
			UnknownAction,
			Tuple<[ThunkMiddleware<RootReducer, UnknownAction, ExtraArguments>]>
		>
	>;

	public get extraArguments(): ExtraArguments {
		return {
			arithmeticGameApi,
			authApi,
			findTheWrongAdminApi,
			findTheWrongGameApi,
			gamesApi,
			profileApi,
			storage,
			trueFalseAdminApi,
			trueFalseGameApi,
		};
	}

	public constructor(config: Config) {
		this.instance = configureStore({
			devTools: config.ENV.APP.ENVIRONMENT !== AppEnvironment.PRODUCTION,
			middleware: (getDefaultMiddleware) => {
				return getDefaultMiddleware({
					thunk: {
						extraArgument: this.extraArguments,
					},
				});
			},
			reducer: resettableRootReducer,
		});

		// A 401 on any authenticated request expires the session: clear the token
		// and reset the store so ProtectedRoute redirects to login.
		setUnauthorizedHandler(() => {
			void storage.drop(StorageKey.TOKEN);
			this.instance.dispatch(sessionExpired());
		});
	}
}

export { Store };
