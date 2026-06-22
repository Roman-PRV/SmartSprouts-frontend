// Virtual board geometry for the arithmetic drag-and-stick board. Cards live in
// a fixed px coordinate space that the player UI scales into its container.
// Cells are sized card + gap, so a jittered one-card-per-cell scatter (jitter
// kept below the gap) can never overlap.
const CARD_WIDTH = 96;
const CARD_HEIGHT = 64;
const CARD_GAP = 28;
const BOARD_PADDING = 16;

// Max center-to-center distance at which a dragged answer snaps onto a free
// equation. Sized generously for imprecise child drags.
const SNAP_THRESHOLD = 60;

// When an answer snaps, it sticks just below its equation by this gap so the
// pair reads as one glued unit.
const SNAP_STICK_GAP = 8;

// Fraction of a cell's spare space (the gap) used to jitter a card off its grid
// anchor. Kept below 1 so a jittered card never crosses into a neighbour cell.
const CARD_JITTER_RATIO = 0.6;

export {
	BOARD_PADDING,
	CARD_GAP,
	CARD_HEIGHT,
	CARD_JITTER_RATIO,
	CARD_WIDTH,
	SNAP_STICK_GAP,
	SNAP_THRESHOLD,
};
