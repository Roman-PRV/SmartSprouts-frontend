// Virtual board geometry for the arithmetic drag-and-stick board. Cards live in
// a fixed px coordinate space that the player UI scales to fill its container.
const CARD_WIDTH = 110;
const CARD_HEIGHT = 64;

// Column gap (also the room a glued answer drops into to the right of its
// equation) — kept a little wider than a card so the pair never touches the next
// column. Cards sit on an even grid; this gap is the only horizontal whitespace.
const CARD_GAP_X = 120;
// Row gap; cards align in rows (no vertical jitter) so resting cards never
// intersect and so never pair by accident.
const CARD_GAP_Y = 50;
const BOARD_PADDING = 20;

// Spread the 20 cards across 5 columns × 4 rows so the board is wide-and-short
// and fills the card width.
const MAX_COLUMNS = 5;

export { BOARD_PADDING, CARD_GAP_X, CARD_GAP_Y, CARD_HEIGHT, CARD_WIDTH, MAX_COLUMNS };
