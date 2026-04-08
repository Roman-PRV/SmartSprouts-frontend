import { useCallback, useEffect, useState } from "react";

import { audioPlayer } from "~/libs/modules/audio-player/audio-player";

import { type UseAudioPlayerResult } from "./libs/types/types";

const useAudioPlayer = (sourceUrl?: string): UseAudioPlayerResult => {
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	useEffect(() => {
		return audioPlayer.subscribe((url: null | string, isPlaying: boolean): void => {
			setIsPlaying(Boolean(sourceUrl && url === sourceUrl && isPlaying));
		});
	}, [sourceUrl]);

	const play = useCallback(
		(url?: string): void => {
			const targetUrl = url ?? sourceUrl;

			if (targetUrl) {
				audioPlayer.play(targetUrl);
			}
		},
		[sourceUrl]
	);

	/**
	 * Stops playback of any currently playing audio in the global player.
	 */
	const stop = useCallback((): void => {
		audioPlayer.stop();
	}, []);

	/**
	 * Pauses playback of any currently playing audio in the global player.
	 */
	const pause = useCallback((): void => {
		audioPlayer.pause();
	}, []);

	const toggle = useCallback(
		(url?: string): void => {
			const targetUrl = url ?? sourceUrl;

			if (targetUrl) {
				audioPlayer.toggle(targetUrl);
			}
		},
		[sourceUrl]
	);

	return { isPlaying, pause, play, stop, toggle };
};

export { useAudioPlayer };
