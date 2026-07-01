// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAudioRegen } from "~/modules/admin/games/true-false/hooks/use-audio-regen/use-audio-regen.hook";
import { AUDIO_REGEN_POLL_INITIAL_MS as POLL_INITIAL_MS } from "~/modules/admin/games/true-false/libs/constants/audio-regen.constant";

const KEY = "level:title_audio_url:en";

describe("useAudioRegen", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("marks the key generating while a request is in flight and clears it once fresh", async () => {
		const { result } = renderHook(() => useAudioRegen());

		const run = vi.fn(() => Promise.resolve());
		let stale = true;
		// One refresh flips the backend to fresh, so polling should stop after it.
		const refresh = vi.fn().mockImplementation(() => {
			stale = false;

			return Promise.resolve();
		});

		let pending: Promise<void> | undefined;
		act(() => {
			pending = result.current.regenerate({
				isStillStale: () => stale,
				key: KEY,
				refresh,
				run,
			});
		});

		expect(result.current.isGenerating(KEY)).toBe(true);

		await act(async () => {
			await vi.advanceTimersByTimeAsync(POLL_INITIAL_MS);
			await pending;
		});

		expect(run).toHaveBeenCalledTimes(1);
		expect(refresh).toHaveBeenCalledTimes(1);
		expect(result.current.isGenerating(KEY)).toBe(false);
	});

	it("still flips generating under StrictMode's mount/unmount/remount", async () => {
		// Regression: the mounted-ref was only set in cleanup, so StrictMode's
		// throwaway unmount left it false and every state update was dropped.
		const { result } = renderHook(() => useAudioRegen(), { wrapper: StrictMode });

		const run = vi.fn(() => Promise.resolve());
		let stale = true;
		const refresh = vi.fn().mockImplementation(() => {
			stale = false;

			return Promise.resolve();
		});

		act(() => {
			void result.current.regenerate({ isStillStale: () => stale, key: KEY, refresh, run });
		});

		expect(result.current.isGenerating(KEY)).toBe(true);

		await act(async () => {
			await vi.runAllTimersAsync();
		});

		expect(result.current.isGenerating(KEY)).toBe(false);
	});

	it("keeps polling while stale and stops once the timeout elapses", async () => {
		const { result } = renderHook(() => useAudioRegen());

		const run = vi.fn(() => Promise.resolve());
		const refresh = vi.fn(() => Promise.resolve());

		let pending: Promise<void> | undefined;
		act(() => {
			pending = result.current.regenerate({
				isStillStale: () => true,
				key: KEY,
				refresh,
				run,
			});
		});

		await act(async () => {
			await vi.runAllTimersAsync();
			await pending;
		});

		// Exact count depends on the backoff schedule; the contract is that it
		// polls repeatedly and then gives up when the timeout is reached.
		expect(refresh.mock.calls.length).toBeGreaterThan(1);
		expect(result.current.isGenerating(KEY)).toBe(false);
	});

	it("clears the generating flag even when the request fails", async () => {
		const { result } = renderHook(() => useAudioRegen());

		const run = vi.fn().mockRejectedValue(new Error("nope"));
		const refresh = vi.fn(() => Promise.resolve());

		await act(async () => {
			await expect(
				result.current.regenerate({ isStillStale: () => true, key: KEY, refresh, run })
			).rejects.toThrow("nope");
		});

		expect(refresh).not.toHaveBeenCalled();
		expect(result.current.isGenerating(KEY)).toBe(false);
	});
});
