import { describe, expect, it } from "vitest";

import { getLevelById } from "~/games/true-false-game/api/slices/true-false-game-actions";
import { actions, reducer } from "~/games/true-false-game/api/slices/true-false-game.slice";
import { type TrueFalseGameLevelDto } from "~/games/true-false-game/libs/types/true-false-game-level-dto.type";
import { DataStatus } from "~/libs/enums/enums";
import { HTTPCode } from "~/libs/modules/http/http";

describe("true-false-game slice", () => {
	const initialState = {
		currentLevel: null,
		currentStatus: DataStatus.IDLE,
		error: null,
	};

	it("should return the initial state", () => {
		expect(reducer(undefined, { type: "UNKNOWN_ACTION" })).toEqual(initialState);
	});

	it("should handle clearCurrentLevel", () => {
		const modifiedState = {
			currentLevel: { id: 1, title: "Test Level" } as unknown as TrueFalseGameLevelDto,
			currentStatus: DataStatus.FULFILLED,
			error: null,
		};
		expect(reducer(modifiedState, actions.clearCurrentLevel())).toEqual(initialState);
	});

	it("should handle getLevelById.pending", () => {
		const action = { type: getLevelById.pending.type };
		const state = reducer(initialState, action);
		expect(state.currentStatus).toEqual(DataStatus.PENDING);
	});

	it("should handle getLevelById.fulfilled", () => {
		const mockLevel = {
			id: 1,
			statements: [],
			title: "Level 1",
		} as unknown as TrueFalseGameLevelDto;
		const action = { payload: mockLevel, type: getLevelById.fulfilled.type };
		const state = reducer(initialState, action);

		expect(state.currentStatus).toEqual(DataStatus.FULFILLED);
		expect(state.currentLevel).toEqual(mockLevel);
	});

	it("should handle getLevelById.rejected with error payload", () => {
		const errorPayload = { message: "Not Found", status: HTTPCode.NOT_FOUND };
		const action = { payload: errorPayload, type: getLevelById.rejected.type };
		const state = reducer(initialState, action);

		expect(state.currentStatus).toEqual(DataStatus.REJECTED);
		expect(state.error).toEqual(errorPayload);
	});

	it("should handle getLevelById.rejected without payload", () => {
		const errorMessage = "Internal Server Error";
		const action = {
			error: { message: errorMessage },
			type: getLevelById.rejected.type,
		};
		const state = reducer(initialState, action);

		expect(state.currentStatus).toEqual(DataStatus.REJECTED);
		expect(state.error).toEqual({ message: errorMessage });
	});

	it("should clear error on getLevelById.pending", () => {
		const stateWithError = {
			...initialState,
			currentStatus: DataStatus.REJECTED,
			error: { message: "Not Found", status: HTTPCode.NOT_FOUND },
		};
		const action = { type: getLevelById.pending.type };
		const state = reducer(stateWithError, action);

		expect(state.currentStatus).toEqual(DataStatus.PENDING);
		expect(state.error).toBeNull();
	});

	it("should clear error on getLevelById.fulfilled", () => {
		const mockLevel = {
			id: 1,
			statements: [],
			title: "Level 1",
		} as unknown as TrueFalseGameLevelDto;
		const stateWithError = {
			...initialState,
			currentStatus: DataStatus.REJECTED,
			error: { message: "Server Error", status: 500 },
		};
		const action = { payload: mockLevel, type: getLevelById.fulfilled.type };
		const state = reducer(stateWithError, action);

		expect(state.currentStatus).toEqual(DataStatus.FULFILLED);
		expect(state.currentLevel).toEqual(mockLevel);
		expect(state.error).toBeNull();
	});
});
