import { useEffect } from "~/libs/hooks/hooks";
import { audioPlayer } from "~/libs/modules/audio-player/audio-player";

const useStopAudioOnUnmount = (sourceUrl?: string): void => {
	useEffect(() => {
		return (): void => {
			if (sourceUrl) {
				audioPlayer.stopIfPlaying(sourceUrl);
			}
		};
	}, [sourceUrl]);
};

export { useStopAudioOnUnmount };
