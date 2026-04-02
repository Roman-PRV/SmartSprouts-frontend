import { type AudioStateListener } from "./libs/types/types";

class BaseAudioPlayer {
	private audio: HTMLAudioElement | null = null;
	private currentUrl: null | string = null;
	private readonly listeners = new Set<AudioStateListener>();

	public destroy(): void {
		if (this.audio) {
			this.audio.pause();
			this.audio.src = "";
			this.audio = null;
		}

		this.currentUrl = null;
		this.listeners.clear();
	}

	public pause(): void {
		if (!this.audio) {
			return;
		}

		this.audio.pause();
	}

	public play(url: string): void {
		if (!this.audio) {
			this.audio = this.createAudio();
		}

		if (this.currentUrl !== url) {
			this.currentUrl = url;
			this.audio.src = url;
			this.audio.load();
		}

		void this.audio.play().catch(() => {
			this.currentUrl = null;
			this.notify(null, false);
		});
	}

	public stop(): void {
		if (!this.audio) {
			return;
		}

		this.audio.pause();
		this.audio.currentTime = 0;
		this.currentUrl = null;
		this.notify(null, false);
	}

	public stopIfPlaying(url: string): void {
		if (this.currentUrl === url) {
			this.stop();
		}
	}

	public subscribe(listener: AudioStateListener): () => void {
		this.listeners.add(listener);
		listener(this.currentUrl, this.audio ? !this.audio.paused : false);

		return () => {
			this.listeners.delete(listener);
		};
	}

	public toggle(url: string): void {
		if (this.currentUrl === url && this.audio && !this.audio.paused) {
			this.pause();
		} else {
			this.play(url);
		}
	}

	private createAudio(): HTMLAudioElement {
		const audio = new Audio();

		audio.addEventListener("ended", () => {
			this.currentUrl = null;
			this.notify(null, false);
		});

		audio.addEventListener("pause", () => {
			this.notify(this.currentUrl, false);
		});

		audio.addEventListener("play", () => {
			this.notify(this.currentUrl, true);
		});

		audio.addEventListener("error", () => {
			this.currentUrl = null;
			this.notify(null, false);
		});

		return audio;
	}

	private notify(url: null | string, isPlaying: boolean): void {
		for (const listener of this.listeners) {
			listener(url, isPlaying);
		}
	}
}

export { BaseAudioPlayer };
