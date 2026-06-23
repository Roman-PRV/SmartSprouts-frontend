import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

import {
	type ArithmeticAttemptAnswerDto,
	type ArithmeticEquationDto,
} from "~/games/arithmetic/arithmetic";
import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";

import { CARD_WIDTH } from "./libs/constants/card-board.constant";
import { cardsOverlap } from "./libs/helpers/cards-overlap/cards-overlap.helper";
import { clampCardPosition } from "./libs/helpers/clamp-card-position/clamp-card-position.helper";
import { createBoardSeed } from "./libs/helpers/create-board-seed/create-board-seed.helper";
import { createRandom } from "./libs/helpers/create-random/create-random.helper";
import { findOverlappingFreeEquation } from "./libs/helpers/find-overlapping-free-equation/find-overlapping-free-equation.helper";
import { scatterCards } from "./libs/helpers/scatter-cards/scatter-cards.helper";
import { shuffle } from "./libs/helpers/shuffle/shuffle.helper";
import {
	type AnswerCard,
	CardKind,
	type CardPosition,
	type EquationCard,
} from "./libs/types/card.type";

type BoardSize = {
	height: number;
	width: number;
};

type BoardState = {
	activeKey: null | string;
	answerCards: AnswerCard[];
	boardSize: BoardSize;
	equationCards: EquationCard[];
	// Scatter positions a dropped card bounces back to if it would overlap others.
	homePositions: Record<string, CardPosition>;
	pairs: Record<string, null | string>;
	positions: Record<string, CardPosition>;
};

type UseCardBoardReturn = {
	activeKey: null | string;
	allMatched: boolean;
	answerCards: AnswerCard[];
	boardSize: BoardSize;
	buildAnswers: () => ArithmeticAttemptAnswerDto[];
	equationCards: EquationCard[];
	onDragEnd: (key: string) => void;
	onDragMove: (key: string, dx: number, dy: number) => void;
	onDragStart: (key: string) => void;
	pairs: Record<string, null | string>;
	positions: Record<string, CardPosition>;
	reset: () => void;
};

const BoardActionType = {
	DRAG_END: "drag-end",
	DRAG_MOVE: "drag-move",
	DRAG_START: "drag-start",
	RESET: "reset",
} as const;

type BoardAction =
	| { dx: number; dy: number; key: string; type: typeof BoardActionType.DRAG_MOVE }
	| { key: string; type: typeof BoardActionType.DRAG_END }
	| { key: string; type: typeof BoardActionType.DRAG_START }
	| { state: BoardState; type: typeof BoardActionType.RESET };

/**
 * Free the answer `key` from its pair (only answers are draggable), so picking it
 * up detaches it from its equation.
 */
const releasePair = (
	pairs: Record<string, null | string>,
	answerKey: string
): Record<string, null | string> => {
	const next = { ...pairs };

	for (const equationKey of Object.keys(next)) {
		if (next[equationKey] === answerKey) {
			next[equationKey] = null;
		}
	}

	return next;
};

const createBoardState = (equations: ArithmeticEquationDto[]): BoardState => {
	const random = createRandom(createBoardSeed(equations));

	const equationCards: EquationCard[] = equations.map((equation) => ({
		equationId: equation.id,
		key: `eq-${String(equation.id)}`,
		operandA: equation.operand_a,
		operandB: equation.operand_b,
		type: CardKind.EQUATION,
	}));

	const answerCards: AnswerCard[] = shuffle(
		equations.map((equation) => equation.result),
		random
	).map((value, index) => ({
		key: `ans-${String(index)}`,
		type: CardKind.ANSWER,
		value,
	}));

	const { boardSize, positions } = scatterCards({
		answerKeys: answerCards.map((card) => card.key),
		equationKeys: equationCards.map((card) => card.key),
		random,
	});

	const pairs: Record<string, null | string> = {};

	for (const card of equationCards) {
		pairs[card.key] = null;
	}

	return {
		activeKey: null,
		answerCards,
		boardSize,
		equationCards,
		homePositions: { ...positions },
		pairs,
		positions,
	};
};

const reducer = (state: BoardState, action: BoardAction): BoardState => {
	switch (action.type) {
		case BoardActionType.DRAG_END: {
			const position = state.positions[action.key];

			if (position === undefined) {
				return { ...state, activeKey: null };
			}

			const isAnswer = state.answerCards.some((card) => card.key === action.key);

			if (isAnswer) {
				const equationKey = findOverlappingFreeEquation({
					answerPosition: position,
					equationCards: state.equationCards,
					pairs: state.pairs,
					positions: state.positions,
				});

				if (equationKey !== null) {
					const equationPosition = state.positions[equationKey] as CardPosition;

					return {
						...state,
						activeKey: null,
						pairs: { ...state.pairs, [equationKey]: action.key },
						positions: {
							...state.positions,
							// Glue the answer flush to the equation's right edge (no gap)
							// so the pair reads as one seamless capsule.
							[action.key]: { x: equationPosition.x + CARD_WIDTH, y: equationPosition.y },
						},
					};
				}
			}

			// Not paired: if dropped on top of others, bounce it back home (best
			// effort — the home cell is normally free, though another card could in
			// theory have been parked there meanwhile).
			const others = Object.entries(state.positions)
				.filter(([otherKey]) => otherKey !== action.key)
				.map(([, otherPosition]) => otherPosition);

			if (cardsOverlap(position, others)) {
				return {
					...state,
					activeKey: null,
					positions: {
						...state.positions,
						[action.key]: state.homePositions[action.key] ?? position,
					},
				};
			}

			return { ...state, activeKey: null };
		}

		case BoardActionType.DRAG_MOVE: {
			const current = state.positions[action.key];

			if (current === undefined) {
				return state;
			}

			const next = clampCardPosition({
				boardSize: state.boardSize,
				position: { x: current.x + action.dx, y: current.y + action.dy },
			});

			return {
				...state,
				positions: { ...state.positions, [action.key]: next },
			};
		}

		case BoardActionType.DRAG_START: {
			return { ...state, activeKey: action.key, pairs: releasePair(state.pairs, action.key) };
		}

		case BoardActionType.RESET: {
			return action.state;
		}

		default: {
			return state;
		}
	}
};

/**
 * Operation-agnostic drag-and-stick board for the arithmetic game family. Owns
 * card positions and equation↔answer pairs in local state only (no network, no
 * DOM); the player UI renders from `positions`/`pairs` and feeds pointer deltas
 * back through the drag handlers. Snapping, breaking and the submit payload all
 * live here so multiplication, addition and future operations reuse it as-is.
 *
 * The board rebuilds on the equations' content seed, not the array identity, so
 * passing a fresh array each render (e.g. `level.equations ?? []` or an inline
 * `.map`) cannot silently wipe the player's progress.
 */
const useCardBoard = (equations: ArithmeticEquationDto[]): UseCardBoardReturn => {
	const [state, dispatch] = useReducer(reducer, equations, createBoardState);
	const isFirstRender = useRef(true);
	const equationsReference = useRef(equations);

	equationsReference.current = equations;
	const seed = createBoardSeed(equations);

	useEffect((): void => {
		if (isFirstRender.current) {
			isFirstRender.current = false;

			return;
		}

		dispatch({ state: createBoardState(equationsReference.current), type: BoardActionType.RESET });
	}, [seed]);

	const onDragStart = useCallback((key: string): void => {
		dispatch({ key, type: BoardActionType.DRAG_START });
	}, []);

	const onDragMove = useCallback((key: string, dx: number, dy: number): void => {
		dispatch({ dx, dy, key, type: BoardActionType.DRAG_MOVE });
	}, []);

	const onDragEnd = useCallback((key: string): void => {
		dispatch({ key, type: BoardActionType.DRAG_END });
	}, []);

	const reset = useCallback((): void => {
		dispatch({ state: createBoardState(equationsReference.current), type: BoardActionType.RESET });
	}, []);

	const allMatched = useMemo(
		(): boolean =>
			state.equationCards.length > EMPTY_ARRAY_LENGTH &&
			state.equationCards.every((card) => state.pairs[card.key] !== null),
		[state.equationCards, state.pairs]
	);

	const buildAnswers = useCallback((): ArithmeticAttemptAnswerDto[] => {
		const answers: ArithmeticAttemptAnswerDto[] = [];

		for (const card of state.equationCards) {
			const answerKey = state.pairs[card.key];
			const answerCard = state.answerCards.find((item) => item.key === answerKey);

			if (answerCard !== undefined) {
				answers.push({ answer: answerCard.value, equation_id: card.equationId });
			}
		}

		return answers;
	}, [state.answerCards, state.equationCards, state.pairs]);

	return {
		activeKey: state.activeKey,
		allMatched,
		answerCards: state.answerCards,
		boardSize: state.boardSize,
		buildAnswers,
		equationCards: state.equationCards,
		onDragEnd,
		onDragMove,
		onDragStart,
		pairs: state.pairs,
		positions: state.positions,
		reset,
	};
};

export { type UseCardBoardReturn, useCardBoard };
