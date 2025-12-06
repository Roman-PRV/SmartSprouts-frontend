
import { describe, expect, it } from "vitest";

import { getLevelById } from "~/games/true-false-image/api/slices/true-false-image-actions";
import {
    actions,
    reducer,
} from "~/games/true-false-image/api/slices/true-false-image.slice";
import { DataStatus } from "~/libs/enums/enums";
import { type TrueFalseImageLevelDto } from "~/games/true-false-image/libs/types/true-false-image-level-dto.type";

describe("true-false-image slice", () => {
    const initialState = {
        currentLevel: null,
        currentStatus: DataStatus.IDLE,
    };

    it("should return the initial state", () => {
        expect(reducer(undefined, { type: "UNKNOWN_ACTION" })).toEqual(initialState);
    });

    it("should handle clearCurrentLevel", () => {
        const modifiedState = {
            currentLevel: { id: 1, title: "Test Level" } as unknown as TrueFalseImageLevelDto,
            currentStatus: DataStatus.FULFILLED,
        };
        expect(reducer(modifiedState, actions.clearCurrentLevel())).toEqual(initialState);
    });

    it("should handle getLevelById.pending", () => {
        const action = { type: getLevelById.pending.type };
        const state = reducer(initialState, action);
        expect(state.currentStatus).toEqual(DataStatus.PENDING);
    });

    it("should handle getLevelById.fulfilled", () => {
        const mockLevel = { id: 1, title: "Level 1", statements: [] } as unknown as TrueFalseImageLevelDto;
        const action = { payload: mockLevel, type: getLevelById.fulfilled.type };
        const state = reducer(initialState, action);

        expect(state.currentStatus).toEqual(DataStatus.FULFILLED);
        expect(state.currentLevel).toEqual(mockLevel);
    });

    it("should handle getLevelById.rejected", () => {
        const action = { type: getLevelById.rejected.type };
        const state = reducer(initialState, action);
        expect(state.currentStatus).toEqual(DataStatus.REJECTED);
    });
});
