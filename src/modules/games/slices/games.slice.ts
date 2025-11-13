import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type GameDescriptionDto } from "~/libs/types/game-description-dto.type.js";
import { type LevelDescriptionDto, type ValueOf } from "~/libs/types/types.js";

import { getAllGames, getById, getLevelsList } from "./actions.js";

type State = {
	currentGame: GameDescriptionDto | null;
	currentGameLevels: LevelDescriptionDto[] | null;
	dataStatus: ValueOf<typeof DataStatus>;
	games: GameDescriptionDto[];
};

const initialState: State = {
	currentGame: null,
	currentGameLevels: null,
	dataStatus: DataStatus.IDLE,
	games: [],
};

const normalizeGame = (game: GameDescriptionDto): GameDescriptionDto => {
	return {
		...game,
		id: String(game.id),
	};
};

const normalizeGames = (games: GameDescriptionDto[]): GameDescriptionDto[] =>
	games.map((game) => normalizeGame(game));

const { actions, name, reducer } = createSlice({
	extraReducers(builder) {
		builder.addCase(getAllGames.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
		});
		builder.addCase(getAllGames.fulfilled, (state, action) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.games = normalizeGames(action.payload);
		});
		builder.addCase(getAllGames.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
		});
		builder.addCase(getById.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
		});
		builder.addCase(getById.fulfilled, (state, action) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.currentGame = normalizeGame(action.payload);
		});
		builder.addCase(getById.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
		});
		builder.addCase(getLevelsList.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
		});
		builder.addCase(getLevelsList.fulfilled, (state, action) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.currentGameLevels = action.payload;
		});
		builder.addCase(getLevelsList.rejected, (state) => {
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
