import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type GameDescriptionDto } from "~/libs/types/game-description-dto.type.js";
import { type LevelDescriptionDto, type ValueOf } from "~/libs/types/types.js";

import { getAllGames, getById, getLevelsList } from "./actions.js";

type State = {
	currentGame: GameDescriptionDto | null;
	currentGameLevels: LevelDescriptionDto[] | null;
	currentGameStatus: ValueOf<typeof DataStatus>;
	games: GameDescriptionDto[];
	gamesStatus: ValueOf<typeof DataStatus>;
	levelsStatus: ValueOf<typeof DataStatus>;
};

const initialState: State = {
	currentGame: null,
	currentGameLevels: null,
	currentGameStatus: DataStatus.IDLE,
	games: [],
	gamesStatus: DataStatus.IDLE,
	levelsStatus: DataStatus.IDLE,
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
			state.gamesStatus = DataStatus.PENDING;
		});
		builder.addCase(getAllGames.fulfilled, (state, action) => {
			state.gamesStatus = DataStatus.FULFILLED;
			state.games = normalizeGames(action.payload);
		});
		builder.addCase(getAllGames.rejected, (state) => {
			state.gamesStatus = DataStatus.REJECTED;
		});
		builder.addCase(getById.pending, (state) => {
			state.currentGameStatus = DataStatus.PENDING;
		});
		builder.addCase(getById.fulfilled, (state, action) => {
			state.currentGameStatus = DataStatus.FULFILLED;
			state.currentGame = normalizeGame(action.payload);
		});
		builder.addCase(getById.rejected, (state) => {
			state.currentGameStatus = DataStatus.REJECTED;
		});
		builder.addCase(getLevelsList.pending, (state) => {
			state.levelsStatus = DataStatus.PENDING;
		});
		builder.addCase(getLevelsList.fulfilled, (state, action) => {
			state.levelsStatus = DataStatus.FULFILLED;
			state.currentGameLevels = action.payload;
		});
		builder.addCase(getLevelsList.rejected, (state) => {
			state.levelsStatus = DataStatus.REJECTED;
		});
	},
	initialState,
	name: "games",
	reducers: {
		clearCurrentGame: (state) => {
			state.currentGame = null;
			state.currentGameLevels = null;
		},
		setCurrentGame: (state, action: PayloadAction<GameDescriptionDto>) => {
			state.currentGame = action.payload;
		},
	},
});

export { actions, name, reducer };
