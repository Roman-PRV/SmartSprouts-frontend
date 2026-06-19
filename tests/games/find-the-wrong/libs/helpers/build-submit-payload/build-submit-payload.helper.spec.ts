import { describe, expect, it } from "vitest";

import { InteractionMode } from "~/games/find-the-wrong/libs/enums/enums";
import { buildSubmitPayload } from "~/games/find-the-wrong/libs/helpers/build-submit-payload/build-submit-payload.helper";
import { type MatchResult } from "~/games/find-the-wrong/libs/types/types";

describe("buildSubmitPayload", () => {
	it("maps found items to snake_case entries with item_id + stars", () => {
		const result: MatchResult = {
			found: [
				{ iou: 0.8, itemId: 10, stars: 3 },
				{ iou: 0.3, itemId: 20, stars: 2 },
			],
			missedItemIds: [30],
		};

		expect(buildSubmitPayload(result, 42, InteractionMode.CIRCLE)).toEqual({
			duration_seconds: 42,
			found: [
				{ item_id: 10, stars: 3 },
				{ item_id: 20, stars: 2 },
			],
			interaction_mode: "circle",
			missed_item_ids: [30],
		});
	});

	it("carries the marker interaction mode through", () => {
		const result: MatchResult = {
			found: [{ itemId: 1, stars: 3 }],
			missedItemIds: [],
		};

		expect(buildSubmitPayload(result, 10, InteractionMode.MARKER).interaction_mode).toBe("marker");
	});

	it("does not include iou in the payload", () => {
		const result: MatchResult = {
			found: [{ iou: 0.95, itemId: 1, stars: 3 }],
			missedItemIds: [],
		};

		const payload = buildSubmitPayload(result, 10, InteractionMode.CIRCLE);

		expect(payload.found[0]).not.toHaveProperty("iou");
	});

	it("handles empty found list", () => {
		const result: MatchResult = { found: [], missedItemIds: [1, 2, 3] };

		expect(buildSubmitPayload(result, 0, InteractionMode.CIRCLE)).toEqual({
			duration_seconds: 0,
			found: [],
			interaction_mode: "circle",
			missed_item_ids: [1, 2, 3],
		});
	});

	it("returns a fresh missed_item_ids array (does not alias the input)", () => {
		const missed = [1, 2];
		const result: MatchResult = { found: [], missedItemIds: missed };

		const payload = buildSubmitPayload(result, 0, InteractionMode.CIRCLE);

		expect(payload.missed_item_ids).not.toBe(missed);
		expect(payload.missed_item_ids).toEqual(missed);
	});
});
