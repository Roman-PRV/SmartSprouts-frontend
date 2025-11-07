import { createAsyncThunk } from "@reduxjs/toolkit";

import { HTTPError } from "~/libs/modules/http/http.js";
import { type GameDescriptionDto } from "~/libs/types/game-description-dto.type.js";
import { type AsyncThunkConfig } from "~/libs/types/types.js";

import { name as sliceName } from "./games.slice.js";

const getAllGames = createAsyncThunk<GameDescriptionDto[], undefined, AsyncThunkConfig>(
	`${sliceName}/get-all-games`,
	async (_, { extra, rejectWithValue }) => {
		try {
			const { gamesApi } = extra;

			return await gamesApi.getAll();
		} catch (error: unknown) {
			if (error instanceof HTTPError) {
				return rejectWithValue({ message: error.message, status: error.status });
			}

			return rejectWithValue({ message: "Something went wrong" });
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
			if (error instanceof HTTPError) {
				return rejectWithValue({ message: error.message, status: error.status });
			}

			return rejectWithValue({ message: "Failed to fetch game details." });
		}
	}
);

export { getAllGames, getById };
