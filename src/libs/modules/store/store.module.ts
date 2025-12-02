import {
	combineReducers,
	type ThunkMiddleware,
	type Tuple,
	type UnknownAction,
} from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

import {
	trueFalseImageApi,
	reducer as trueFalseImageReducer,
} from "~/games/true-false-image/api/true-false-image-game";
import { AppEnvironment } from "~/libs/enums/enums.js";
import { type Config } from "~/libs/modules/config/config.js";
import { storage } from "~/libs/modules/storage/storage.js";
import { gamesApi, reducer as gamesReducer } from "~/modules/games/games";

type ExtraArguments = {
	gamesApi: typeof gamesApi;
	storage: typeof storage;
	trueFalseImageApi: typeof trueFalseImageApi;
};

type RootReducer = {
	games: ReturnType<typeof gamesReducer>;
	trueFalseImageLevels: ReturnType<typeof trueFalseImageReducer>;
};

const rootReducer = combineReducers({
	games: gamesReducer,
	trueFalseImageLevels: trueFalseImageReducer,
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
			trueFalseImageApi,
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
