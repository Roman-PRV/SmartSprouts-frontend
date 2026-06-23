import { describe, expect, it } from "vitest";

import { createRandom } from "~/libs/hooks/use-card-board/libs/helpers/create-random/create-random.helper";
import { scatterCards } from "~/libs/hooks/use-card-board/libs/helpers/scatter-cards/scatter-cards.helper";

// Mirrors the card dimensions used by scatterCards; two boxes overlap only when
// they are closer than a full card on BOTH axes.
const CARD_WIDTH = 110;
const CARD_HEIGHT = 64;
const SEED = 4242;

const EQUATION_KEYS = ["eq-1", "eq-2", "eq-3"];
const ANSWER_KEYS = ["ans-0", "ans-1", "ans-2"];
const ALL_KEYS = [...EQUATION_KEYS, ...ANSWER_KEYS];

describe("scatterCards", () => {
	it("is deterministic for the same seed", () => {
		const first = scatterCards({ answerKeys: ANSWER_KEYS, equationKeys: EQUATION_KEYS, random: createRandom(SEED) });
		const second = scatterCards({ answerKeys: ANSWER_KEYS, equationKeys: EQUATION_KEYS, random: createRandom(SEED) });

		expect(first.positions).toEqual(second.positions);
		expect(first.boardSize).toEqual(second.boardSize);
	});

	it("places every key", () => {
		const { positions } = scatterCards({ answerKeys: ANSWER_KEYS, equationKeys: EQUATION_KEYS, random: createRandom(SEED) });

		expect(Object.keys(positions).sort((a, b) => a.localeCompare(b))).toEqual(
			[...ALL_KEYS].sort((a, b) => a.localeCompare(b))
		);
	});

	it("never overlaps two card boxes", () => {
		const { positions } = scatterCards({ answerKeys: ANSWER_KEYS, equationKeys: EQUATION_KEYS, random: createRandom(SEED) });
		const points = Object.values(positions);

		for (let outer = 0; outer < points.length; outer += 1) {
			for (let inner = outer + 1; inner < points.length; inner += 1) {
				const a = points[outer] as { x: number; y: number };
				const b = points[inner] as { x: number; y: number };
				const overlaps =
					Math.abs(a.x - b.x) < CARD_WIDTH && Math.abs(a.y - b.y) < CARD_HEIGHT;

				expect(overlaps).toBe(false);
			}
		}
	});

	it("keeps equations out of the rightmost column", () => {
		const { boardSize, positions } = scatterCards({ answerKeys: ANSWER_KEYS, equationKeys: EQUATION_KEYS, random: createRandom(SEED) });
		const rightmostCardLeft = boardSize.width - CARD_WIDTH - 20;

		for (const key of EQUATION_KEYS) {
			expect((positions[key] as { x: number }).x).toBeLessThan(rightmostCardLeft);
		}
	});
});
