import {
	combineReducers,
	type ThunkMiddleware,
	type Tuple,
	type UnknownAction,
} from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

import {
	trueFalseGameApi,
	reducer as trueFalseGameReducer,
} from "~/games/true-false-game/api/true-false-game";
import { AppEnvironment } from "~/libs/enums/enums";
import { type Config } from "~/libs/modules/config/config";
import { storage } from "~/libs/modules/storage/storage";
import { authApi, reducer as authReducer, logout } from "~/modules/auth/auth";
import { gamesApi, reducer as gamesReducer } from "~/modules/games/games";
import { profileApi, reducer as profileReducer } from "~/modules/profile/profile";

type ExtraArguments = {
	authApi: typeof authApi;
	gamesApi: typeof gamesApi;
	profileApi: typeof profileApi;
	storage: typeof storage;
	trueFalseGameApi: typeof trueFalseGameApi;
};

type RootReducer = {
	auth: ReturnType<typeof authReducer>;
	games: ReturnType<typeof gamesReducer>;
	profile: ReturnType<typeof profileReducer>;
	trueFalseLevels: ReturnType<typeof trueFalseGameReducer>;
};

const rootReducer = combineReducers({
	auth: authReducer,
	games: gamesReducer,
	profile: profileReducer,
	trueFalseLevels: trueFalseGameReducer,
});

const resettableRootReducer = (
	state: RootReducer | undefined,
	action: UnknownAction
): RootReducer => {
	if (action.type === logout.fulfilled.type) {
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
			authApi,
			gamesApi,
			profileApi,
			storage,
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
	}
}

export { Store };
