import { describe, expect, it } from "vitest";

import { DataStatus } from "~/libs/enums/enums";
import { getById, getLevelsList } from "~/modules/games/slices/actions";
import { reducer } from "~/modules/games/slices/games.slice";

const initialState = {
	currentGame: null,
	currentGameLevels: null,
	currentGameStatus: DataStatus.IDLE,
	currentLevelsGameId: null,
	games: [],
	gamesStatus: DataStatus.IDLE,
	levelsStatus: DataStatus.IDLE,
};

const pendingState = { ...initialState, currentGameStatus: DataStatus.PENDING };
const levelsPendingState = { ...initialState, levelsStatus: DataStatus.PENDING };

describe("games slice", () => {
	it("returns the initial state", () => {
		expect(reducer(undefined, { type: "UNKNOWN" })).toEqual(initialState);
	});

	it("records the loaded game id on getLevelsList.fulfilled (from meta.arg)", () => {
		const state = reducer(levelsPendingState, {
			meta: { arg: "5" },
			payload: [{ id: 1 }],
			type: getLevelsList.fulfilled.type,
		});

		expect(state.levelsStatus).toBe(DataStatus.FULFILLED);
		expect(state.currentLevelsGameId).toBe("5");
		expect(state.currentGameLevels).toEqual([{ id: 1 }]);
	});

	it("sets REJECTED on a real getById failure", () => {
		const state = reducer(pendingState, {
			meta: { aborted: false },
			type: getById.rejected.type,
		});

		expect(state.currentGameStatus).toBe(DataStatus.REJECTED);
	});

	it("ignores an aborted getById rejection (no error flash)", () => {
		const state = reducer(pendingState, {
			meta: { aborted: true },
			type: getById.rejected.type,
		});

		expect(state.currentGameStatus).toBe(DataStatus.PENDING);
	});

	it("sets REJECTED on a real getLevelsList failure", () => {
		const state = reducer(levelsPendingState, {
			meta: { aborted: false },
			type: getLevelsList.rejected.type,
		});

		expect(state.levelsStatus).toBe(DataStatus.REJECTED);
	});

	it("ignores an aborted getLevelsList rejection (no error flash)", () => {
		const state = reducer(levelsPendingState, {
			meta: { aborted: true },
			type: getLevelsList.rejected.type,
		});

		expect(state.levelsStatus).toBe(DataStatus.PENDING);
	});
});
