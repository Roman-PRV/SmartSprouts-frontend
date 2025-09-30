import { type GameDescriptionDto } from "~/types/game-description-dto.type";

export const GamesApi = {
	async fetchGames(): Promise<GameDescriptionDto[]> {
		const response = await fetch("/api/games");

		if (!response.ok) {
			throw new Error("Failed to fetch games");
		}

		return (await response.json()) as GameDescriptionDto[];
	},
};
