import { useCallback, useEffect, useRef, useState } from "~/libs/hooks/hooks";

import {
	AUDIO_REGEN_POLL_BACKOFF_FACTOR,
	AUDIO_REGEN_POLL_INITIAL_MS,
	AUDIO_REGEN_POLL_MAX_MS,
	AUDIO_REGEN_TIMEOUT_MS,
} from "../../libs/constants/audio-regen.constant";

type RegenerateOptions = {
	/** Whether this field/locale is still stale; polling stops once it is false. */
	isStillStale: () => boolean;
	key: string;
	refresh: () => Promise<void>;
	run: () => Promise<void>;
};

/**
 * `completed` — backend flipped `is_stale` to false within the timeout.
 * `timeout` — still stale after the timeout; the caller should notify the user.
 * `aborted` — the editor unmounted mid-poll; no user-facing feedback needed.
 */
type RegenerateOutcome = "aborted" | "completed" | "timeout";

type UseAudioRegenReturn = {
	isGenerating: (key: string) => boolean;
	regenerate: (options: RegenerateOptions) => Promise<RegenerateOutcome>;
};

const wait = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

/**
 * Tracks per-(field, locale) "generating" state and polls the level on an
 * exponential backoff until the backend clears `is_stale` (or the timeout hits),
 * keeping the flag set for the whole wait so the UI never flashes idle mid-job.
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
		async ({ isStillStale, key, refresh, run }: RegenerateOptions): Promise<RegenerateOutcome> => {
			setGenerating(key, true);

			try {
				await run();

				let elapsed = 0;
				let delay = AUDIO_REGEN_POLL_INITIAL_MS;

				while (elapsed < AUDIO_REGEN_TIMEOUT_MS) {
					await wait(delay);

					if (!isMountedReference.current) {
						return "aborted";
					}

					await refresh();

					if (!isStillStale()) {
						return "completed";
					}

					elapsed += delay;
					delay = Math.min(delay * AUDIO_REGEN_POLL_BACKOFF_FACTOR, AUDIO_REGEN_POLL_MAX_MS);
				}

				return "timeout";
			} catch (error) {
				// Abort on unmount (navigation) rejects here — report it as "aborted"
				// so the caller stays silent; a real error (still mounted) propagates.
				if (!isMountedReference.current) {
					return "aborted";
				}

				throw error;
			} finally {
				setGenerating(key, false);
			}
		},
		[setGenerating]
	);

	return { isGenerating, regenerate };
};

export { useAudioRegen };
