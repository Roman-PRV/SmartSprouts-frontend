import { createAsyncThunk } from "@reduxjs/toolkit";

import type {
	AsyncThunkConfig,
	GameDescriptionDto,
	GameWithLevelsDto,
	LevelDescriptionDto,
} from "~/libs/types/types.js";

import { normalizeError } from "~/libs/helpers/normalize-error/normalize-error.js";

import { actions as gamesSliceActions, name as sliceName } from "./games.slice.js";

const getAllGames = createAsyncThunk<GameDescriptionDto[], undefined, AsyncThunkConfig>(
	`${sliceName}/get-all-games`,
	async (_, { extra, rejectWithValue }) => {
		try {
			const { gamesApi } = extra;

			return await gamesApi.getAll();
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const getById = createAsyncThunk<GameDescriptionDto, string, AsyncThunkConfig>(
	`${sliceName}/get-game-by-id`,
	async (gameId, { extra, rejectWithValue }) => {
		try {
			const { gamesApi } = extra;

			return await gamesApi.getById(gameId);
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const getLevelsList = createAsyncThunk<LevelDescriptionDto[], string, AsyncThunkConfig>(
	`${sliceName}/get-levels-list`,
	async (gameId, { extra, rejectWithValue }) => {
		try {
			const { gamesApi } = extra;

			return await gamesApi.getLevelsList(gameId);
		} catch (error: unknown) {
			return rejectWithValue(normalizeError(error));
		}
	}
);

const loadGameWithLevels = createAsyncThunk<GameWithLevelsDto, string, AsyncThunkConfig>(
	`${sliceName}/load-game-with-levels`,
	async (gameId, { dispatch, rejectWithValue }) => {
		try {
			dispatch(gamesSliceActions.clearCurrentGame());
			const game = await dispatch(getById(gameId)).unwrap();
			const levels = await dispatch(getLevelsList(gameId)).unwrap();

			return { game, levels };
		} catch (error: unknown) {
			const normalized = normalizeError(error);

			return rejectWithValue(normalized);
		}
	}
);

export { getAllGames, getById, getLevelsList, loadGameWithLevels };
