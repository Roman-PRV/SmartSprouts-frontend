import { useCallback, useEffect, useState } from "~/libs/hooks/hooks";
import { audioPlayer } from "~/libs/modules/audio-player/audio-player";

import { type UseAudioPlayerResult } from "./libs/types/types";

const useAudioPlayer = (sourceUrl?: string): UseAudioPlayerResult => {
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [currentUrl, setCurrentUrl] = useState<null | string>(null);

	useEffect(() => {
		return audioPlayer.subscribe((url: null | string, isPlaying: boolean): void => {
			setCurrentUrl(url);
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

	const stop = useCallback((): void => {
		audioPlayer.stop();
	}, []);

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

	return { currentUrl, isPlaying, pause, play, stop, toggle };
};

export { useAudioPlayer };
