import { type Point } from "~/libs/types/types";

import { MIN_POLYGON_VERTICES } from "./polygon-mutations.helper";

type DrawingAction =
	| { type: "ADD_VERTEX"; vertex: Point }
	| { type: "CANCEL_DRAWING" }
	| { type: "CLOSE_DRAWING" }
	| { type: "START_DRAWING" };

type DrawingState =
	| { mode: "drawing"; vertices: Point[] }
	| { mode: "idle" };

const initialDrawingState: DrawingState = { mode: "idle" };

const drawingReducer = (state: DrawingState, action: DrawingAction): DrawingState => {
	switch (action.type) {
		case "ADD_VERTEX": {
			if (state.mode !== "drawing") {
				return state;
			}

			return { mode: "drawing", vertices: [...state.vertices, action.vertex] };
		}

		case "CANCEL_DRAWING": {
			return { mode: "idle" };
		}

		case "CLOSE_DRAWING": {
			if (state.mode !== "drawing" || state.vertices.length < MIN_POLYGON_VERTICES) {
				return state;
			}

			return { mode: "idle" };
		}

		case "START_DRAWING": {
			return { mode: "drawing", vertices: [] };
		}
	}
};

const canCloseDrawing = (state: DrawingState): boolean =>
	state.mode === "drawing" && state.vertices.length >= MIN_POLYGON_VERTICES;

export { type DrawingState, canCloseDrawing, drawingReducer, initialDrawingState };
