import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type GameDescriptionDto } from "~/libs/types/game-description-dto.type.js";
import { type ValueOf } from "~/libs/types/types.js";

import { getAllGames } from "./actions.js";

type State = {
	currentGame: GameDescriptionDto | null;
	dataStatus: ValueOf<typeof DataStatus>;
	games: GameDescriptionDto[];
};

const initialState: State = {
	currentGame: null,
	dataStatus: DataStatus.IDLE,
	games: [],
};

const { actions, name, reducer } = createSlice({
	extraReducers(builder) {
		builder.addCase(getAllGames.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
		});
		builder.addCase(getAllGames.fulfilled, (state, action) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.games = action.payload;
		});
		builder.addCase(getAllGames.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
		});
	},
	initialState,
	name: "games",
	reducers: {
		clearCurrentGame: (state) => {
			state.currentGame = null;
		},
		setCurrentGame: (state, action: PayloadAction<GameDescriptionDto>) => {
			state.currentGame = action.payload;
		},
	},
});

export { actions, name, reducer };
