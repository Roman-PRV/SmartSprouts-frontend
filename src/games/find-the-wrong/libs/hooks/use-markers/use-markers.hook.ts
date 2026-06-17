import { useCallback, useState } from "react";

import { generateClientId } from "~/libs/helpers/helpers";
import { type Point } from "~/libs/types/types";

import { MARKER_HIT_RADIUS } from "../../constants/constants";
import { type Marker } from "../../types/types";

const X = 0;
const Y = 1;

const isNear = (a: Point, b: Point): boolean =>
	Math.hypot(a[X] - b[X], a[Y] - b[Y]) <= MARKER_HIT_RADIUS;

type UseMarkersReturn = {
	clearAll: () => void;
	markers: Marker[];
	toggleMarker: (point: Point) => void;
};

/**
 * Tap state for marker mode. A tap near an existing marker removes it
 * (proximity within MARKER_HIT_RADIUS); otherwise it drops a new marker
 * timestamped with the tap moment, so match scoring can derive speed-based stars.
 * Adding stops at `limit` marks (removal always allowed).
 */
const useMarkers = (limit = Number.POSITIVE_INFINITY): UseMarkersReturn => {
	const [markers, setMarkers] = useState<Marker[]>([]);

	const toggleMarker = useCallback(
		(point: Point): void => {
			setMarkers((previous) => {
				const existing = previous.find((marker) => isNear(marker.point, point));

				if (existing) {
					return previous.filter((marker) => marker.id !== existing.id);
				}

				if (previous.length >= limit) {
					return previous;
				}

				return [...previous, { id: generateClientId(), placedAtMs: Date.now(), point }];
			});
		},
		[limit]
	);

	const clearAll = useCallback((): void => {
		setMarkers([]);
	}, []);

	return { clearAll, markers, toggleMarker };
};

export { useMarkers };
