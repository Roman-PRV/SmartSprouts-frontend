import { describe, expect, it } from "vitest";

import {
	canCloseDrawing,
	drawingReducer,
	type DrawingState,
	initialDrawingState,
} from "~/modules/admin/games/find-the-wrong/libs/helpers/drawing-state-machine.helper";

describe("drawing state machine", () => {
	it("starts in idle mode", () => {
		expect(initialDrawingState).toEqual({ mode: "idle" });
	});

	it("START_DRAWING moves to drawing with no vertices", () => {
		const next = drawingReducer(initialDrawingState, { type: "START_DRAWING" });

		expect(next).toEqual({ mode: "drawing", vertices: [] });
	});

	it("ADD_VERTEX appends a vertex while in drawing mode", () => {
		const drawing: DrawingState = { mode: "drawing", vertices: [[0, 0]] };
		const next = drawingReducer(drawing, { type: "ADD_VERTEX", vertex: [0.5, 0.5] });

		expect(next).toEqual({ mode: "drawing", vertices: [[0, 0], [0.5, 0.5]] });
	});

	it("ADD_VERTEX is a no-op when idle", () => {
		const next = drawingReducer(initialDrawingState, {
			type: "ADD_VERTEX",
			vertex: [0, 0],
		});

		expect(next).toEqual(initialDrawingState);
	});

	it("CLOSE_DRAWING returns to idle only when polygon has >= 3 vertices", () => {
		const drawing: DrawingState = {
			mode: "drawing",
			vertices: [[0, 0], [1, 0], [0.5, 1]],
		};
		const next = drawingReducer(drawing, { type: "CLOSE_DRAWING" });

		expect(next).toEqual({ mode: "idle" });
	});

	it("CLOSE_DRAWING is a no-op when polygon has < 3 vertices", () => {
		const drawing: DrawingState = { mode: "drawing", vertices: [[0, 0], [1, 0]] };
		const next = drawingReducer(drawing, { type: "CLOSE_DRAWING" });

		expect(next).toBe(drawing);
	});

	it("CANCEL_DRAWING always returns to idle", () => {
		const drawing: DrawingState = { mode: "drawing", vertices: [[0, 0], [1, 0]] };
		const next = drawingReducer(drawing, { type: "CANCEL_DRAWING" });

		expect(next).toEqual({ mode: "idle" });
	});

	describe("canCloseDrawing", () => {
		it("returns false in idle mode", () => {
			expect(canCloseDrawing(initialDrawingState)).toBe(false);
		});

		it("returns false when drawing has < 3 vertices", () => {
			expect(canCloseDrawing({ mode: "drawing", vertices: [[0, 0], [1, 0]] })).toBe(false);
		});

		it("returns true when drawing has >= 3 vertices", () => {
			expect(
				canCloseDrawing({ mode: "drawing", vertices: [[0, 0], [1, 0], [0.5, 1]] })
			).toBe(true);
		});
	});
});
