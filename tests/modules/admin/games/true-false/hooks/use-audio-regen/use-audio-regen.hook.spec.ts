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

		let pending: Promise<string> | undefined;
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

	it("passes the freshly fetched level to isStillStale", async () => {
		const { result } = renderHook(() => useAudioRegen());

		const freshLevel = { id: 1 };
		const run = vi.fn(() => Promise.resolve());
		const refresh = vi.fn(() => Promise.resolve(freshLevel));
		const isStillStale = vi.fn(() => false);

		let pending: Promise<string> | undefined;
		act(() => {
			pending = result.current.regenerate({ isStillStale, key: KEY, refresh, run });
		});

		let outcome: string | undefined;
		await act(async () => {
			await vi.advanceTimersByTimeAsync(POLL_INITIAL_MS);
			outcome = await pending;
		});

		expect(outcome).toBe("completed");
		expect(isStillStale).toHaveBeenCalledWith(freshLevel);
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

		let pending: Promise<string> | undefined;
		act(() => {
			pending = result.current.regenerate({
				isStillStale: () => true,
				key: KEY,
				refresh,
				run,
			});
		});

		let outcome: string | undefined;
		await act(async () => {
			await vi.runAllTimersAsync();
			outcome = await pending;
		});

		// Exact count depends on the backoff schedule; the contract is that it
		// polls repeatedly and then reports a timeout when it stays stale.
		expect(refresh.mock.calls.length).toBeGreaterThan(1);
		expect(outcome).toBe("timeout");
		expect(result.current.isGenerating(KEY)).toBe(false);
	});

	it("reports aborted (never rejects) when unmounted while a request is in flight", async () => {
		const { result, unmount } = renderHook(() => useAudioRegen());

		let rejectRun!: (reason: unknown) => void;

		const run = vi.fn(
			() =>
				new Promise<void>((_resolve, reject) => {
					rejectRun = reject;
				})
		);
		const refresh = vi.fn(() => Promise.resolve());

		let pending: Promise<string> | undefined;
		act(() => {
			pending = result.current.regenerate({ isStillStale: () => true, key: KEY, refresh, run });
		});

		// Navigating away unmounts the editor (mounted-ref → false), then the
		// aborted thunk rejects the in-flight request.
		unmount();
		act(() => {
			rejectRun(new Error("Aborted"));
		});

		await expect(pending).resolves.toBe("aborted");
		expect(refresh).not.toHaveBeenCalled();
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
