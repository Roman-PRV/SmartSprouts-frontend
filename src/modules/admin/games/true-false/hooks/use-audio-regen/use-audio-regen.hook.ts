import { useCallback, useEffect, useRef, useState } from "~/libs/hooks/hooks";

import {
	AUDIO_REGEN_POLL_BACKOFF_FACTOR,
	AUDIO_REGEN_POLL_INITIAL_MS,
	AUDIO_REGEN_POLL_MAX_MS,
	AUDIO_REGEN_TIMEOUT_MS,
} from "../../libs/constants/audio-regen.constant";

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
 * "generating" state. After firing the request it polls the level on an
 * exponential backoff until the backend flips `is_stale` to false (or the
 * timeout elapses), keeping the generating flag set for the whole wait so the
 * UI never looks idle while a long TTS job is still running.
 */
const useAudioRegen = (): UseAudioRegenReturn => {
	const [generatingKeys, setGeneratingKeys] = useState<ReadonlySet<string>>(new Set());
	const isMountedReference = useRef(true);

	useEffect(() => {
		// Set on every mount: React StrictMode mounts → unmounts → remounts in
		// dev, and without re-arming here the ref would stay false after the
		// throwaway unmount, silently dropping all state updates below.
		isMountedReference.current = true;

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

				let elapsed = 0;
				let delay = AUDIO_REGEN_POLL_INITIAL_MS;

				while (elapsed < AUDIO_REGEN_TIMEOUT_MS) {
					await wait(delay);

					if (!isMountedReference.current) {
						return;
					}

					await refresh();

					if (!isStillStale()) {
						break;
					}

					elapsed += delay;
					delay = Math.min(delay * AUDIO_REGEN_POLL_BACKOFF_FACTOR, AUDIO_REGEN_POLL_MAX_MS);
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
