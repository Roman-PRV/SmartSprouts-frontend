import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";
import { type GameDescriptionDto } from "~/types/game-description-dto.type.js";

import { GamesApi } from "./games.api.js";

const gamesApi = new GamesApi({
	baseUrl: "http://localhost:3000",
	http,
	storage,
});

const getAllGames = createAsyncThunk<GameDescriptionDto[]>("games/getAll", async () => {
	return await gamesApi.getAll();
});

export { getAllGames };
