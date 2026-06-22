import { describe, expect, it } from "vitest";

import { getLevelById } from "~/games/arithmetic/api/slices/arithmetic-game-actions";
import { actions, reducer } from "~/games/arithmetic/api/slices/arithmetic-game.slice";
import { type ArithmeticLevelDto } from "~/games/arithmetic/libs/types/types";
import { DataStatus } from "~/libs/enums/enums";
import { HTTPCode } from "~/libs/modules/http/http";

describe("arithmetic-game slice", () => {
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
			currentLevel: { id: 1, operator: "×", title: "Multiply by 1" } as ArithmeticLevelDto,
			currentStatus: DataStatus.FULFILLED,
			error: null,
		};

		expect(reducer(modifiedState, actions.clearCurrentLevel())).toEqual(initialState);
	});

	it("should handle getLevelById.pending", () => {
		const state = reducer(initialState, { type: getLevelById.pending.type });

		expect(state.currentStatus).toEqual(DataStatus.PENDING);
	});

	it("should handle getLevelById.fulfilled", () => {
		const mockLevel = {
			equations: [],
			id: 3,
			operator: "×",
			title: "Multiply by 3",
		} as unknown as ArithmeticLevelDto;
		const state = reducer(initialState, {
			payload: mockLevel,
			type: getLevelById.fulfilled.type,
		});

		expect(state.currentStatus).toEqual(DataStatus.FULFILLED);
		expect(state.currentLevel).toEqual(mockLevel);
	});

	it("should handle getLevelById.rejected with error payload", () => {
		const errorPayload = { message: "Not Found", status: HTTPCode.NOT_FOUND };
		const state = reducer(initialState, {
			payload: errorPayload,
			type: getLevelById.rejected.type,
		});

		expect(state.currentStatus).toEqual(DataStatus.REJECTED);
		expect(state.error).toEqual(errorPayload);
	});

	it("should handle getLevelById.rejected without payload", () => {
		const errorMessage = "Internal Server Error";
		const state = reducer(initialState, {
			error: { message: errorMessage },
			type: getLevelById.rejected.type,
		});

		expect(state.currentStatus).toEqual(DataStatus.REJECTED);
		expect(state.error).toEqual({ message: errorMessage });
	});

	it("should clear error on getLevelById.pending", () => {
		const stateWithError = {
			...initialState,
			currentStatus: DataStatus.REJECTED,
			error: { message: "Not Found", status: HTTPCode.NOT_FOUND },
		};
		const state = reducer(stateWithError, { type: getLevelById.pending.type });

		expect(state.currentStatus).toEqual(DataStatus.PENDING);
		expect(state.error).toBeNull();
	});
});
