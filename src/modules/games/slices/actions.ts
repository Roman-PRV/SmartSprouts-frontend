import { createAsyncThunk } from "@reduxjs/toolkit";

import { normalizeError } from "~/libs/helpers/helpers.js";
import {
	type AsyncThunkConfig,
	type GameDescriptionDto,
	type LevelDescriptionDto,
} from "~/libs/types/types.js";

import { name as sliceName } from "./games.slice.js";

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

export { getAllGames, getById, getLevelsList };
