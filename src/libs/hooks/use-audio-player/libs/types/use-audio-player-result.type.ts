type UseAudioPlayerResult = {
	currentUrl: null | string;
	isPlaying: boolean;
	pause: () => void;
	play: (url?: string) => void;
	stop: () => void;
	toggle: (url?: string) => void;
};

export { type UseAudioPlayerResult };
