import { useCallback, useState } from "react";

import { generateClientId } from "~/libs/helpers/helpers";
import { type Point, type Stroke } from "~/libs/types/types";

type UseStrokesReturn = {
	addStroke: (points: Point[]) => void;
	clearAll: () => void;
	strokes: Stroke[];
};

const useStrokes = (limit = Number.POSITIVE_INFINITY): UseStrokesReturn => {
	const [strokes, setStrokes] = useState<Stroke[]>([]);

	const addStroke = useCallback(
		(points: Point[]): void => {
			const newStroke: Stroke = { id: generateClientId(), points };

			setStrokes((previous) => (previous.length >= limit ? previous : [...previous, newStroke]));
		},
		[limit]
	);

	const clearAll = useCallback((): void => {
		setStrokes([]);
	}, []);

	return { addStroke, clearAll, strokes };
};

export { useStrokes };
