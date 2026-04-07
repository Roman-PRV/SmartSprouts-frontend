import { useEffect, useState } from "react";

import { type UseProgressResult } from "./libs/types/types";

const PROGRESS_START = 0;
const PROGRESS_END = 100;
const PROGRESS_STEP = 1;
const TICK_INTERVAL_MS = 30;

/**
 * Simulates a loading progress from 0 to 100.
 * When an external `value` is provided it acts as a controlled progress source;
 * when omitted the hook runs an auto-incrementing simulation.
 *
 * Switching between controlled (value) and uncontrolled (undefined) modes
 * at runtime will reset the progress to 0 and restart the simulation.
 */
const useProgress = (value?: number): UseProgressResult => {
	const [progress, setProgress] = useState<number>(PROGRESS_START);

	useEffect(() => {
		if (value !== undefined) {
			setProgress(Math.min(PROGRESS_END, Math.max(PROGRESS_START, value)));

			return;
		}

		setProgress(PROGRESS_START);

		const interval = setInterval(() => {
			setProgress((previous) => {
				if (previous >= PROGRESS_END) {
					clearInterval(interval);

					return PROGRESS_END;
				}

				return previous + PROGRESS_STEP;
			});
		}, TICK_INTERVAL_MS);

		return (): void => {
			clearInterval(interval);
		};
	}, [value]);

	return { progress };
};

export { useProgress };
