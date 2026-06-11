import { describe, expect, it } from "vitest";

import { type Point } from "~/libs/types/types";
import {
	insertVertexAfter,
	moveVertex,
	removeVertex,
} from "~/modules/admin/games/find-the-wrong/libs/helpers/polygon-mutations.helper";

const triangle: Point[] = [
	[0, 0],
	[1, 0],
	[0.5, 1],
];

const quad: Point[] = [
	[0, 0],
	[1, 0],
	[1, 1],
	[0, 1],
];

describe("polygon mutations", () => {
	describe("moveVertex", () => {
		it("replaces the target vertex with the new point", () => {
			const next = moveVertex(triangle, 1, [0.9, 0.1]);

			expect(next[1]).toEqual([0.9, 0.1]);
			expect(next[0]).toEqual([0, 0]);
			expect(next[2]).toEqual([0.5, 1]);
		});
	});

	describe("removeVertex", () => {
		it("removes the vertex at the given index when polygon has > 3 vertices", () => {
			const next = removeVertex(quad, 2);

			expect(next).not.toBeNull();
			expect(next?.length).toBe(3);
			expect(next).toEqual([
				[0, 0],
				[1, 0],
				[0, 1],
			]);
		});

		it("returns null when polygon has exactly 3 vertices", () => {
			const next = removeVertex(triangle, 0);

			expect(next).toBeNull();
		});

		it("returns null when polygon has fewer than 3 vertices", () => {
			const degenerate: Point[] = [[0, 0], [1, 1]];

			expect(removeVertex(degenerate, 0)).toBeNull();
		});
	});

	describe("insertVertexAfter", () => {
		it("inserts a new vertex after the given edge index", () => {
			const next = insertVertexAfter(triangle, 0, [0.5, 0]);

			expect(next).toEqual([
				[0, 0],
				[0.5, 0],
				[1, 0],
				[0.5, 1],
			]);
		});
	});
});
