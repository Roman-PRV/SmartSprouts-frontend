import { useCallback, useEffect, useRef, useState } from "~/libs/hooks/hooks";

import {
	AUDIO_REGEN_MAX_POLL_ATTEMPTS,
	AUDIO_REGEN_POLL_BACKOFF_MS,
} from "../../libs/constants/audio-regen.constant";

const ATTEMPT_INCREMENT = 1;

type RegenerateOptions = {
	/**
	 * Reads the latest `is_stale` for this field/locale from the store. Polling
	 * stops as soon as it returns false (the backend finished regenerating).
	 */
	isStillStale: () => boolean;
	/** Unique key for this (field, locale) pair. */
	key: string;
	/** Re-fetches the level so the store reflects fresh audio status. */
	refresh: () => Promise<void>;
	/** Fires the regeneration request (dispatches the regenerate thunk). */
	run: () => Promise<void>;
};

type UseAudioRegenReturn = {
	isGenerating: (key: string) => boolean;
	regenerate: (options: RegenerateOptions) => Promise<void>;
};

const wait = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

/**
 * Tracks per-(field, locale) regeneration so each audio button can show its own
 * "generating" state. After firing the request it polls the level a bounded
 * number of times (short backoff) until the backend flips `is_stale` to false,
 * then clears the generating flag. A manual refresh remains available because
 * the caller owns `refresh`.
 */
const useAudioRegen = (): UseAudioRegenReturn => {
	const [generatingKeys, setGeneratingKeys] = useState<ReadonlySet<string>>(new Set());
	const isMountedReference = useRef(true);

	useEffect(() => {
		return (): void => {
			isMountedReference.current = false;
		};
	}, []);

	const setGenerating = useCallback((key: string, value: boolean): void => {
		if (!isMountedReference.current) {
			return;
		}

		setGeneratingKeys((previous) => {
			const next = new Set(previous);

			if (value) {
				next.add(key);
			} else {
				next.delete(key);
			}

			return next;
		});
	}, []);

	const isGenerating = useCallback(
		(key: string): boolean => generatingKeys.has(key),
		[generatingKeys]
	);

	const regenerate = useCallback(
		async ({ isStillStale, key, refresh, run }: RegenerateOptions): Promise<void> => {
			setGenerating(key, true);

			try {
				await run();

				for (
					let attempt = 0;
					attempt < AUDIO_REGEN_MAX_POLL_ATTEMPTS;
					attempt += ATTEMPT_INCREMENT
				) {
					await wait(AUDIO_REGEN_POLL_BACKOFF_MS);

					if (!isMountedReference.current) {
						return;
					}

					await refresh();

					if (!isStillStale()) {
						break;
					}
				}
			} finally {
				setGenerating(key, false);
			}
		},
		[setGenerating]
	);

	return { isGenerating, regenerate };
};

export { useAudioRegen };
