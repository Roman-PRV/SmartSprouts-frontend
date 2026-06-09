import { describe, expect, it } from "vitest";

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

		expect(buildSubmitPayload(result, 42)).toEqual({
			duration_seconds: 42,
			found: [
				{ item_id: 10, stars: 3 },
				{ item_id: 20, stars: 2 },
			],
			missed_item_ids: [30],
		});
	});

	it("does not include iou in the payload", () => {
		const result: MatchResult = {
			found: [{ iou: 0.95, itemId: 1, stars: 3 }],
			missedItemIds: [],
		};

		const payload = buildSubmitPayload(result, 10);

		expect(payload.found[0]).not.toHaveProperty("iou");
	});

	it("handles empty found list", () => {
		const result: MatchResult = { found: [], missedItemIds: [1, 2, 3] };

		expect(buildSubmitPayload(result, 0)).toEqual({
			duration_seconds: 0,
			found: [],
			missed_item_ids: [1, 2, 3],
		});
	});

	it("handles empty missed list", () => {
		const result: MatchResult = {
			found: [{ iou: 1, itemId: 1, stars: 3 }],
			missedItemIds: [],
		};

		expect(buildSubmitPayload(result, 5).missed_item_ids).toEqual([]);
	});

	it("returns a fresh missed_item_ids array (does not alias the input)", () => {
		const missed = [1, 2];
		const result: MatchResult = { found: [], missedItemIds: missed };

		const payload = buildSubmitPayload(result, 0);

		expect(payload.missed_item_ids).not.toBe(missed);
		expect(payload.missed_item_ids).toEqual(missed);
	});
});
