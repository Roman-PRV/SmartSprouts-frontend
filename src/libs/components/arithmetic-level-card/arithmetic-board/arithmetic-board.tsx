import { getValidClassNames } from "~/libs/helpers/helpers";
import { useCallback, useContainerSize, useMemo, useRef } from "~/libs/hooks/hooks";
import {
	CARD_HEIGHT,
	CARD_WIDTH,
} from "~/libs/hooks/use-card-board/libs/constants/card-board.constant";
import { type UseCardBoardReturn } from "~/libs/hooks/use-card-board/use-card-board.hook";

import styles from "./styles.module.css";

const Z_INDEX_BASE = 1;
const Z_INDEX_PAIRED = 2;
const Z_INDEX_ACTIVE = 3;
const SCALE_FALLBACK = 1;
const EMPTY_WIDTH = 0;
const CARD_KEY_ATTRIBUTE = "cardKey";

type DragState = {
	key: string;
	x: number;
	y: number;
};

type Properties = {
	board: UseCardBoardReturn;
	operator: string;
};

const ArithmeticBoard: React.FC<Properties> = ({ board, operator }) => {
	const { activeKey, answerCards, boardSize, equationCards, onDragEnd, onDragMove, onDragStart, pairs, positions } =
		board;
	const { containerReference, size } = useContainerSize<HTMLDivElement>();
	const draggingReference = useRef<DragState | null>(null);

	// Scale the fixed virtual board DOWN to fit the available width (never up, so
	// cards keep their native size on wide screens). No scrollbar either way.
	const scale =
		size.width > EMPTY_WIDTH
			? Math.min(SCALE_FALLBACK, size.width / boardSize.width)
			: SCALE_FALLBACK;
	const scaleReference = useRef(scale);

	scaleReference.current = scale;

	const pairedAnswerKeys = useMemo((): Set<string> => {
		const keys = new Set<string>();

		for (const answerKey of Object.values(pairs)) {
			if (answerKey !== null) {
				keys.add(answerKey);
			}
		}

		return keys;
	}, [pairs]);

	const handlePointerDown = useCallback(
		(event: React.PointerEvent<HTMLButtonElement>): void => {
			const key = event.currentTarget.dataset[CARD_KEY_ATTRIBUTE];

			if (key === undefined) {
				return;
			}

			event.currentTarget.setPointerCapture(event.pointerId);
			draggingReference.current = { key, x: event.clientX, y: event.clientY };
			onDragStart(key);
		},
		[onDragStart]
	);

	const handlePointerMove = useCallback(
		(event: React.PointerEvent<HTMLButtonElement>): void => {
			const dragging = draggingReference.current;

			if (dragging === null) {
				return;
			}

			const factor = scaleReference.current;

			onDragMove(
				dragging.key,
				(event.clientX - dragging.x) / factor,
				(event.clientY - dragging.y) / factor
			);
			dragging.x = event.clientX;
			dragging.y = event.clientY;
		},
		[onDragMove]
	);

	const handlePointerUp = useCallback((): void => {
		const dragging = draggingReference.current;

		if (dragging === null) {
			return;
		}

		onDragEnd(dragging.key);
		draggingReference.current = null;
	}, [onDragEnd]);

	const renderCard = ({
		cardKey,
		content,
		interactive,
		isPaired,
		modifier,
	}: {
		cardKey: string;
		content: React.ReactNode;
		interactive: boolean;
		isPaired: boolean;
		modifier: string;
	}): null | React.ReactElement => {
		const position = positions[cardKey];

		if (position === undefined) {
			return null;
		}

		let zIndex = Z_INDEX_BASE;

		if (isPaired) {
			zIndex = Z_INDEX_PAIRED;
		}

		if (activeKey === cardKey) {
			zIndex = Z_INDEX_ACTIVE;
		}

		// Equations are fixed: only answer cards get drag handlers.
		const dragHandlers = interactive
			? {
				onPointerCancel: handlePointerUp,
				onPointerDown: handlePointerDown,
				onPointerMove: handlePointerMove,
				onPointerUp: handlePointerUp,
			}
			: {};

		return (
			<button
				className={getValidClassNames(
					styles["card"],
					modifier,
					isPaired && styles["card--paired"],
					!interactive && styles["card--static"]
				)}
				data-card-key={cardKey}
				key={cardKey}
				style={{ height: CARD_HEIGHT, left: position.x, top: position.y, width: CARD_WIDTH, zIndex }}
				type="button"
				{...dragHandlers}
			>
				{content}
			</button>
		);
	};

	return (
		<div
			className={styles["board"]}
			ref={containerReference}
			style={{ height: boardSize.height * scale }}
		>
			<div
				className={styles["board__surface"]}
				style={{
					height: boardSize.height,
					transform: `scale(${String(scale)})`,
					width: boardSize.width,
				}}
			>
				{equationCards.map((card) =>
					renderCard({
						cardKey: card.key,
						content: (
							<>
								{card.operandA} {operator} {card.operandB} =
							</>
						),
						interactive: false,
						isPaired: pairs[card.key] !== null,
						modifier: styles["card--equation"] ?? "",
					})
				)}
				{answerCards.map((card) =>
					renderCard({
						cardKey: card.key,
						content: card.value,
						interactive: true,
						isPaired: pairedAnswerKeys.has(card.key),
						modifier: styles["card--answer"] ?? "",
					})
				)}
			</div>
		</div>
	);
};

export { ArithmeticBoard };
