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
import { AppEnvironment } from "~/libs/enums/enums.js";
import { type Config } from "~/libs/modules/config/config.js";
import { storage } from "~/libs/modules/storage/storage.js";
import { gamesApi, reducer as gamesReducer } from "~/modules/games/games";

type ExtraArguments = {
	gamesApi: typeof gamesApi;
	storage: typeof storage;
	trueFalseGameApi: typeof trueFalseGameApi;
};

type RootReducer = {
	games: ReturnType<typeof gamesReducer>;
	trueFalseLevels: ReturnType<typeof trueFalseGameReducer>;
};

const rootReducer = combineReducers({
	games: gamesReducer,
	trueFalseLevels: trueFalseGameReducer,
});

const resettableRootReducer = (
	state: RootReducer | undefined,
	action: UnknownAction
): RootReducer => {
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
			gamesApi,
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
