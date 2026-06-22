/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type ArithmeticEquationDto } from "~/games/arithmetic/arithmetic";
import { useCardBoard } from "~/libs/hooks/use-card-board/use-card-board.hook";

const EQUATIONS: ArithmeticEquationDto[] = [
	{ id: 1, operand_a: 3, operand_b: 1, result: 3 },
	{ id: 2, operand_a: 3, operand_b: 2, result: 6 },
];

// Same shape, different content (another level) — must rebuild the board.
const OTHER_EQUATIONS: ArithmeticEquationDto[] = [
	{ id: 1, operand_a: 5, operand_b: 1, result: 5 },
	{ id: 2, operand_a: 5, operand_b: 2, result: 10 },
];

const FAR_AWAY = 1000;

type Board = ReturnType<typeof useCardBoard>;

const dragOnto = (current: () => Board, key: string, targetKey: string): void => {
	const from = current().positions[key] as { x: number; y: number };
	const to = current().positions[targetKey] as { x: number; y: number };

	act(() => {
		current().onDragStart(key);
	});
	act(() => {
		current().onDragMove(key, to.x - from.x, to.y - from.y);
	});
	act(() => {
		current().onDragEnd(key);
	});
};

describe("useCardBoard", () => {
	it("builds one equation card and one answer card per equation", () => {
		const { result } = renderHook(() => useCardBoard(EQUATIONS));

		expect(result.current.equationCards).toHaveLength(EQUATIONS.length);
		expect(result.current.answerCards).toHaveLength(EQUATIONS.length);
		expect(result.current.allMatched).toBe(false);
	});

	it("pairs an answer dropped onto a free equation", () => {
		const { result } = renderHook(() => useCardBoard(EQUATIONS));

		dragOnto(() => result.current, "ans-0", "eq-1");

		expect(result.current.pairs["eq-1"]).toBe("ans-0");
	});

	it("does not pair an answer dropped far from every equation", () => {
		const { result } = renderHook(() => useCardBoard(EQUATIONS));

		act(() => {
			result.current.onDragStart("ans-0");
		});
		act(() => {
			result.current.onDragMove("ans-0", FAR_AWAY, FAR_AWAY);
		});
		act(() => {
			result.current.onDragEnd("ans-0");
		});

		expect(result.current.pairs["eq-1"]).toBeNull();
		expect(result.current.pairs["eq-2"]).toBeNull();
	});

	it("breaks the pair when a stuck answer is dragged again", () => {
		const { result } = renderHook(() => useCardBoard(EQUATIONS));

		dragOnto(() => result.current, "ans-0", "eq-1");
		expect(result.current.pairs["eq-1"]).toBe("ans-0");

		act(() => {
			result.current.onDragStart("ans-0");
		});

		expect(result.current.pairs["eq-1"]).toBeNull();
	});

	it("reports allMatched only once every equation is paired", () => {
		const { result } = renderHook(() => useCardBoard(EQUATIONS));

		dragOnto(() => result.current, "ans-0", "eq-1");
		expect(result.current.allMatched).toBe(false);

		dragOnto(() => result.current, "ans-1", "eq-2");
		expect(result.current.allMatched).toBe(true);
	});

	it("builds the submit payload from the formed pairs", () => {
		const { result } = renderHook(() => useCardBoard(EQUATIONS));

		dragOnto(() => result.current, "ans-0", "eq-1");

		const answerValue = result.current.answerCards.find((card) => card.key === "ans-0")?.value;
		const payload = result.current.buildAnswers();

		expect(payload).toEqual([{ answer: answerValue, equation_id: 1 }]);
	});

	it("leaves a second answer unpaired when only an occupied equation is in range", () => {
		const { result } = renderHook(() => useCardBoard(EQUATIONS));

		dragOnto(() => result.current, "ans-0", "eq-1");
		dragOnto(() => result.current, "ans-1", "eq-1");

		expect(result.current.pairs["eq-1"]).toBe("ans-0");
		expect(result.current.pairs["eq-2"]).toBeNull();
	});

	it("keeps progress when the equations array identity changes but content is the same", () => {
		const { rerender, result } = renderHook(({ eqs }) => useCardBoard(eqs), {
			initialProps: { eqs: EQUATIONS },
		});

		dragOnto(() => result.current, "ans-0", "eq-1");
		const pairedAnswer = result.current.pairs["eq-1"];

		// A fresh array with identical content — must NOT rebuild the board.
		rerender({ eqs: EQUATIONS.map((equation) => ({ ...equation })) });

		expect(result.current.pairs["eq-1"]).toBe(pairedAnswer);
	});

	it("rebuilds the board when the equations content changes", () => {
		const { rerender, result } = renderHook(({ eqs }) => useCardBoard(eqs), {
			initialProps: { eqs: EQUATIONS },
		});

		dragOnto(() => result.current, "ans-0", "eq-1");
		expect(result.current.pairs["eq-1"]).not.toBeNull();

		rerender({ eqs: OTHER_EQUATIONS });

		expect(result.current.pairs["eq-1"]).toBeNull();
		expect(result.current.equationCards[0]?.operandA).toBe(OTHER_EQUATIONS[0]?.operand_a);
	});

	it("clears all pairs on reset", () => {
		const { result } = renderHook(() => useCardBoard(EQUATIONS));

		dragOnto(() => result.current, "ans-0", "eq-1");
		dragOnto(() => result.current, "ans-1", "eq-2");
		expect(result.current.allMatched).toBe(true);

		act(() => {
			result.current.reset();
		});

		expect(result.current.pairs["eq-1"]).toBeNull();
		expect(result.current.pairs["eq-2"]).toBeNull();
		expect(result.current.allMatched).toBe(false);
	});
});
