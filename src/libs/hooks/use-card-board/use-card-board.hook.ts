import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

import {
	type ArithmeticAttemptAnswerDto,
	type ArithmeticEquationDto,
} from "~/games/arithmetic/arithmetic";
import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";

import { CARD_HEIGHT, SNAP_STICK_GAP, SNAP_THRESHOLD } from "./libs/constants/card-board.constant";
import { createBoardSeed } from "./libs/helpers/create-board-seed/create-board-seed.helper";
import { createRandom } from "./libs/helpers/create-random/create-random.helper";
import { findNearestFreeEquation } from "./libs/helpers/find-nearest-free-equation/find-nearest-free-equation.helper";
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
 * Release any pair that involves `key`: dragging either the equation or its
 * stuck answer breaks the link, so the answer becomes free again.
 */
const releasePair = (
	pairs: Record<string, null | string>,
	key: string
): Record<string, null | string> => {
	const next = { ...pairs };

	if (key in next) {
		next[key] = null;

		return next;
	}

	for (const equationKey of Object.keys(next)) {
		if (next[equationKey] === key) {
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

	const keys = [
		...equationCards.map((card) => card.key),
		...answerCards.map((card) => card.key),
	];
	const { boardSize, positions } = scatterCards(keys, random);

	const pairs: Record<string, null | string> = {};

	for (const card of equationCards) {
		pairs[card.key] = null;
	}

	return { activeKey: null, answerCards, boardSize, equationCards, pairs, positions };
};

const reducer = (state: BoardState, action: BoardAction): BoardState => {
	switch (action.type) {
		case BoardActionType.DRAG_END: {
			const answerCard = state.answerCards.find((card) => card.key === action.key);
			const answerPosition = state.positions[action.key];

			if (answerCard === undefined || answerPosition === undefined) {
				return { ...state, activeKey: null };
			}

			const equationKey = findNearestFreeEquation({
				answerPosition,
				equationCards: state.equationCards,
				pairs: state.pairs,
				positions: state.positions,
				threshold: SNAP_THRESHOLD,
			});

			if (equationKey === null) {
				return { ...state, activeKey: null };
			}

			const equationPosition = state.positions[equationKey] as CardPosition;

			return {
				...state,
				activeKey: null,
				pairs: { ...state.pairs, [equationKey]: action.key },
				positions: {
					...state.positions,
					[action.key]: {
						x: equationPosition.x,
						y: equationPosition.y + CARD_HEIGHT + SNAP_STICK_GAP,
					},
				},
			};
		}

		case BoardActionType.DRAG_MOVE: {
			const current = state.positions[action.key];

			if (current === undefined) {
				return state;
			}

			return {
				...state,
				positions: {
					...state.positions,
					[action.key]: { x: current.x + action.dx, y: current.y + action.dy },
				},
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

export { useCardBoard };
