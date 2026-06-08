/**
 * @vitest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useFitStageSize } from "~/libs/hooks/use-fit-stage-size/use-fit-stage-size.hook";
import { type ImageDimensions, type StageSize } from "~/libs/types/types";

const renderFit = (container: StageSize, image: ImageDimensions) =>
	renderHook(({ container: c, image: index }) => useFitStageSize(c, index), {
		initialProps: { container, image },
	});

describe("useFitStageSize", () => {
	it("returns zero size when container has no dimensions", () => {
		const { result } = renderFit({ height: 0, width: 0 }, { height: 200, width: 400 });

		expect(result.current).toEqual({ height: 0, width: 0 });
	});

	it("returns zero size when image has no dimensions", () => {
		const { result } = renderFit({ height: 600, width: 800 }, { height: 0, width: 0 });

		expect(result.current).toEqual({ height: 0, width: 0 });
	});

	it("fits a square image into a wide container by limiting width to height", () => {
		const { result } = renderFit({ height: 200, width: 800 }, { height: 100, width: 100 });

		expect(result.current).toEqual({ height: 200, width: 200 });
	});

	it("fits a wide image into a square container by limiting height to width", () => {
		const { result } = renderFit({ height: 400, width: 400 }, { height: 100, width: 200 });

		expect(result.current).toEqual({ height: 200, width: 400 });
	});

	it("preserves image aspect ratio when container matches it exactly", () => {
		const { result } = renderFit({ height: 300, width: 600 }, { height: 100, width: 200 });

		expect(result.current).toEqual({ height: 300, width: 600 });
	});

	it("memoises the result across re-renders with the same inputs", () => {
		const container: StageSize = { height: 400, width: 800 };
		const image: ImageDimensions = { height: 200, width: 400 };
		const { rerender, result } = renderFit(container, image);
		const first = result.current;

		rerender({ container, image });

		expect(result.current).toBe(first);
	});
});
