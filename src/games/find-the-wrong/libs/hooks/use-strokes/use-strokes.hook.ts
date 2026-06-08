import { useCallback, useState } from "react";

import { type Point, type Stroke } from "~/libs/types/types";

type UseStrokesReturn = {
	addStroke: (points: Point[]) => void;
	clearAll: () => void;
	strokes: Stroke[];
};

const useStrokes = (): UseStrokesReturn => {
	const [strokes, setStrokes] = useState<Stroke[]>([]);

	const addStroke = useCallback((points: Point[]): void => {
		setStrokes((previous) => [...previous, { id: crypto.randomUUID(), points }]);
	}, []);

	const clearAll = useCallback((): void => {
		setStrokes([]);
	}, []);

	return { addStroke, clearAll, strokes };
};

export { useStrokes };
