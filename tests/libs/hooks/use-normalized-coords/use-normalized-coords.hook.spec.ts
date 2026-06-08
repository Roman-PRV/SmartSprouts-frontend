/**
 * @vitest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useNormalizedCoords } from "~/libs/hooks/use-normalized-coords/use-normalized-coords.hook";
import { type Point, type StageSize } from "~/libs/types/types";

const STAGE: StageSize = { height: 400, width: 800 };
const ZERO_STAGE: StageSize = { height: 0, width: 0 };

const renderCoords = (stage: StageSize = STAGE) =>
	renderHook(({ stage: s }) => useNormalizedCoords(s), {
		initialProps: { stage },
	});

describe("useNormalizedCoords", () => {
	describe("toNormalized", () => {
		it("returns [0, 0] for the top-left corner", () => {
			const { result } = renderCoords();

			expect(result.current.toNormalized([0, 0])).toEqual([0, 0]);
		});

		it("returns [1, 1] for the bottom-right corner", () => {
			const { result } = renderCoords();

			expect(result.current.toNormalized([STAGE.width, STAGE.height])).toEqual([1, 1]);
		});

		it("returns [0.5, 0.5] for the centre", () => {
			const { result } = renderCoords();

			expect(result.current.toNormalized([STAGE.width / 2, STAGE.height / 2])).toEqual([
				0.5, 0.5,
			]);
		});

		it("does NOT clamp values above the stage", () => {
			const { result } = renderCoords();

			expect(result.current.toNormalized([STAGE.width * 2, STAGE.height * 2])).toEqual([
				2, 2,
			]);
		});

		it("does NOT clamp negative values", () => {
			const { result } = renderCoords();

			expect(result.current.toNormalized([-STAGE.width, -STAGE.height])).toEqual([-1, -1]);
		});

		it("returns [0, 0] when the stage has no dimensions", () => {
			const { result } = renderCoords(ZERO_STAGE);

			expect(result.current.toNormalized([100, 100])).toEqual([0, 0]);
		});
	});

	describe("toPixel", () => {
		it("maps [0, 0] back to the origin", () => {
			const { result } = renderCoords();

			expect(result.current.toPixel([0, 0])).toEqual([0, 0]);
		});

		it("maps [1, 1] back to the stage corner", () => {
			const { result } = renderCoords();

			expect(result.current.toPixel([1, 1])).toEqual([STAGE.width, STAGE.height]);
		});

		it("maps [0.25, 0.75] proportionally", () => {
			const { result } = renderCoords();

			expect(result.current.toPixel([0.25, 0.75])).toEqual([
				STAGE.width * 0.25,
				STAGE.height * 0.75,
			]);
		});
	});

	describe("round trip", () => {
		it("normalises then de-normalises an in-bounds pixel back to itself", () => {
			const { result } = renderCoords();
			const sample: Point = [123, 250];

			const roundTripped = result.current.toPixel(result.current.toNormalized(sample));

			expect(roundTripped[0]).toBeCloseTo(sample[0]);
			expect(roundTripped[1]).toBeCloseTo(sample[1]);
		});

		it("normalises then de-normalises an out-of-bounds pixel back to itself", () => {
			const { result } = renderCoords();
			const sample: Point = [STAGE.width * 1.5, -50];

			const roundTripped = result.current.toPixel(result.current.toNormalized(sample));

			expect(roundTripped[0]).toBeCloseTo(sample[0]);
			expect(roundTripped[1]).toBeCloseTo(sample[1]);
		});
	});

	describe("memoisation", () => {
		it("returns the same api instance when stage is unchanged", () => {
			const { rerender, result } = renderCoords();
			const first = result.current;

			rerender({ stage: STAGE });

			expect(result.current).toBe(first);
		});

		it("returns a fresh api instance when the stage changes", () => {
			const { rerender, result } = renderCoords();
			const first = result.current;

			rerender({ stage: { height: 600, width: 1200 } });

			expect(result.current).not.toBe(first);
		});
	});
});
