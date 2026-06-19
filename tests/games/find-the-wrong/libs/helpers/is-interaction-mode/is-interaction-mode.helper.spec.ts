import { describe, expect, it } from "vitest";

import { InteractionMode } from "~/games/find-the-wrong/libs/enums/enums";
import {
	INTERACTION_MODES,
	isInteractionMode,
} from "~/games/find-the-wrong/libs/helpers/is-interaction-mode/is-interaction-mode.helper";

describe("isInteractionMode", () => {
	it("accepts every known interaction mode", () => {
		for (const mode of INTERACTION_MODES) {
			expect(isInteractionMode(mode)).toBe(true);
		}
	});

	it("accepts the circle and marker literals", () => {
		expect(isInteractionMode(InteractionMode.CIRCLE)).toBe(true);
		expect(isInteractionMode(InteractionMode.MARKER)).toBe(true);
	});

	it("rejects unknown strings", () => {
		expect(isInteractionMode("swipe")).toBe(false);
		expect(isInteractionMode("")).toBe(false);
		expect(isInteractionMode("CIRCLE")).toBe(false);
	});
});

describe("INTERACTION_MODES", () => {
	it("lists exactly the InteractionMode values", () => {
		expect([...INTERACTION_MODES]).toEqual([InteractionMode.CIRCLE, InteractionMode.MARKER]);
	});
});
