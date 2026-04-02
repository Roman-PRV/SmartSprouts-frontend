/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAudioPlayer } from "~/libs/hooks/use-audio-player/use-audio-player.hook";

// ─── Types ────────────────────────────────────────────────────────────────────

type SubscribeCallback = (url: null | string, isPlaying: boolean) => void;

// ─── Hoisted mocks (must be before vi.mock) ────────────────────────────────
// vi.mock is hoisted to the top of the file by Vitest, so any variables
// referenced inside the factory must also be hoisted via vi.hoisted().

const { audioPlayerMock, unsubscribeMock } = vi.hoisted(() => {
	const unsubscribeMock = vi.fn();

	const audioPlayerMock = {
		pause: vi.fn(),
		play: vi.fn(),
		stop: vi.fn(),
		subscribe: vi.fn<(listener: SubscribeCallback) => () => void>(),
		toggle: vi.fn(),
	};

	return { audioPlayerMock, unsubscribeMock };
});

vi.mock("~/libs/modules/audio-player/audio-player", () => ({
	audioPlayer: audioPlayerMock,
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SOURCE_URL = "https://example.com/audio.mp3";
const OTHER_URL = "https://example.com/other.mp3";

let capturedListener: SubscribeCallback | null = null;

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useAudioPlayer", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		capturedListener = null;

		audioPlayerMock.subscribe.mockImplementation((listener: SubscribeCallback) => {
			capturedListener = listener;
			// Simulate initial state call (nothing is playing)
			listener(null, false);
			return unsubscribeMock;
		});
	});

	describe("initial state", () => {
		it("should return isPlaying=false on mount with sourceUrl", () => {
			const { result } = renderHook(() => useAudioPlayer(SOURCE_URL));

			expect(result.current.isPlaying).toBe(false);
		});

		it("should return isPlaying=false on mount without sourceUrl", () => {
			const { result } = renderHook(() => useAudioPlayer());

			expect(result.current.isPlaying).toBe(false);
		});
	});

	describe("subscription lifecycle", () => {
		it("should call audioPlayer.subscribe once on mount", () => {
			renderHook(() => useAudioPlayer(SOURCE_URL));

			expect(audioPlayerMock.subscribe).toHaveBeenCalledTimes(1);
		});

		it("should call the unsubscribe function on unmount", () => {
			const { unmount } = renderHook(() => useAudioPlayer(SOURCE_URL));

			unmount();

			expect(unsubscribeMock).toHaveBeenCalledTimes(1);
		});
	});

	describe("isPlaying state", () => {
		it("should set isPlaying=true when listener fires with matching url and isPlaying=true", () => {
			const { result } = renderHook(() => useAudioPlayer(SOURCE_URL));

			act(() => {
				capturedListener?.(SOURCE_URL, true);
			});

			expect(result.current.isPlaying).toBe(true);
		});

		it("should set isPlaying=false when listener fires with a different url", () => {
			const { result } = renderHook(() => useAudioPlayer(SOURCE_URL));

			act(() => {
				capturedListener?.(SOURCE_URL, true);
			});

			act(() => {
				capturedListener?.(OTHER_URL, true);
			});

			expect(result.current.isPlaying).toBe(false);
		});

		it("should set isPlaying=false when listener fires with same url but isPlaying=false", () => {
			const { result } = renderHook(() => useAudioPlayer(SOURCE_URL));

			act(() => {
				capturedListener?.(SOURCE_URL, true);
			});

			act(() => {
				capturedListener?.(SOURCE_URL, false);
			});

			expect(result.current.isPlaying).toBe(false);
		});

		it("should keep isPlaying=false when no sourceUrl and listener fires", () => {
			const { result } = renderHook(() => useAudioPlayer());

			act(() => {
				capturedListener?.(SOURCE_URL, true);
			});

			expect(result.current.isPlaying).toBe(false);
		});
	});

	describe("play()", () => {
		it("should call audioPlayer.play with the explicitly provided url", () => {
			const { result } = renderHook(() => useAudioPlayer(SOURCE_URL));

			act(() => {
				result.current.play(OTHER_URL);
			});

			expect(audioPlayerMock.play).toHaveBeenCalledWith(OTHER_URL);
		});

		it("should call audioPlayer.play with sourceUrl when no url argument is passed", () => {
			const { result } = renderHook(() => useAudioPlayer(SOURCE_URL));

			act(() => {
				result.current.play();
			});

			expect(audioPlayerMock.play).toHaveBeenCalledWith(SOURCE_URL);
		});

		it("should NOT call audioPlayer.play when both url argument and sourceUrl are absent", () => {
			const { result } = renderHook(() => useAudioPlayer());

			act(() => {
				result.current.play();
			});

			expect(audioPlayerMock.play).not.toHaveBeenCalled();
		});
	});

	describe("pause()", () => {
		it("should delegate to audioPlayer.pause", () => {
			const { result } = renderHook(() => useAudioPlayer(SOURCE_URL));

			act(() => {
				result.current.pause();
			});

			expect(audioPlayerMock.pause).toHaveBeenCalledTimes(1);
		});
	});

	describe("stop()", () => {
		it("should delegate to audioPlayer.stop", () => {
			const { result } = renderHook(() => useAudioPlayer(SOURCE_URL));

			act(() => {
				result.current.stop();
			});

			expect(audioPlayerMock.stop).toHaveBeenCalledTimes(1);
		});
	});

	describe("toggle()", () => {
		it("should call audioPlayer.toggle with the explicitly provided url", () => {
			const { result } = renderHook(() => useAudioPlayer(SOURCE_URL));

			act(() => {
				result.current.toggle(OTHER_URL);
			});

			expect(audioPlayerMock.toggle).toHaveBeenCalledWith(OTHER_URL);
		});

		it("should call audioPlayer.toggle with sourceUrl when no url argument is passed", () => {
			const { result } = renderHook(() => useAudioPlayer(SOURCE_URL));

			act(() => {
				result.current.toggle();
			});

			expect(audioPlayerMock.toggle).toHaveBeenCalledWith(SOURCE_URL);
		});

		it("should NOT call audioPlayer.toggle when both url argument and sourceUrl are absent", () => {
			const { result } = renderHook(() => useAudioPlayer());

			act(() => {
				result.current.toggle();
			});

			expect(audioPlayerMock.toggle).not.toHaveBeenCalled();
		});
	});
});
