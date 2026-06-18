// IoU bands for the "circle the wrong object" match. The drawn stroke must
// first be a closed loop (see CLOSURE_GAP_RATIO); only then is it compared to
// the item polygon by area IoU = overlap / union. Because a loop that fully
// contains the item has IoU ≈ itemArea / loopArea, the thresholds map to "how
// much bigger than the object the circle may be": found ≈ up to 8× area,
// 2 stars ≈ 3.3×, 3 stars ≈ 2×.
const IOU_FOUND_THRESHOLD = 0.12;
const IOU_TWO_STARS = 0.3;
const IOU_THREE_STARS = 0.5;
const MIN_STROKE_POINTS_FOR_IOU = 3;

// A stroke counts as a closed loop when the gap between its first and last
// point is at most this fraction of its bounding-box diagonal. Open lines and
// arcs (endpoints far apart) are rejected, so auto-closing them into a spurious
// area polygon can no longer produce false matches.
const CLOSURE_GAP_RATIO = 0.25;

// Time bands for marker (tap) mode: stars come from how fast each object was
// first found, in seconds from level load. < 60s ⇒ 3★, < 180s ⇒ 2★, else 1★.
const STAR_TIME_THREE_SECONDS = 60;
const STAR_TIME_TWO_SECONDS = 180;

export {
	CLOSURE_GAP_RATIO,
	IOU_FOUND_THRESHOLD,
	IOU_THREE_STARS,
	IOU_TWO_STARS,
	MIN_STROKE_POINTS_FOR_IOU,
	STAR_TIME_THREE_SECONDS,
	STAR_TIME_TWO_SECONDS,
};
