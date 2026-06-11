import { type Point } from "~/libs/types/types";

const MIN_POLYGON_VERTICES = 3;
const NEXT_OFFSET = 1;
const NO_DELETIONS = 0;

const moveVertex = (points: Point[], vertexIndex: number, point: Point): Point[] =>
	points.map((current, index) => (index === vertexIndex ? point : current));

const removeVertex = (points: Point[], vertexIndex: number): null | Point[] => {
	if (points.length <= MIN_POLYGON_VERTICES) {
		return null;
	}

	return points.filter((_, index) => index !== vertexIndex);
};

const insertVertexAfter = (points: Point[], edgeIndex: number, point: Point): Point[] => {
	const nextPoints = [...points];

	nextPoints.splice(edgeIndex + NEXT_OFFSET, NO_DELETIONS, point);

	return nextPoints;
};

export { insertVertexAfter, MIN_POLYGON_VERTICES, moveVertex, removeVertex };

