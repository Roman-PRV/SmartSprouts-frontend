import { useCallback, useEffect, useRef, useState } from "react";

import { EMPTY_DIMENSION, FIRST_INDEX } from "~/libs/constants/constants";
import { type StageSize } from "~/libs/types/types";

type UseContainerSizeReturn<T extends HTMLElement> = {
	containerReference: (node: null | T) => void;
	size: StageSize;
};

const useContainerSize = <T extends HTMLElement>(): UseContainerSizeReturn<T> => {
	const observerReference = useRef<null | ResizeObserver>(null);
	const [size, setSize] = useState<StageSize>({
		height: EMPTY_DIMENSION,
		width: EMPTY_DIMENSION,
	});

	const containerReference = useCallback((node: null | T): void => {
		if (observerReference.current) {
			observerReference.current.disconnect();
			observerReference.current = null;
		}

		if (!node) {
			return;
		}

		const observer = new ResizeObserver((entries) => {
			const entry = entries[FIRST_INDEX];

			if (!entry) {
				return;
			}

			setSize({
				height: entry.contentRect.height,
				width: entry.contentRect.width,
			});
		});

		observer.observe(node);
		observerReference.current = observer;
	}, []);

	useEffect(() => {
		return (): void => {
			observerReference.current?.disconnect();
			observerReference.current = null;
		};
	}, []);

	return { containerReference, size };
};

export { useContainerSize };
