// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAudioRegen } from "~/modules/admin/games/true-false/hooks/use-audio-regen/use-audio-regen.hook";
import {
	AUDIO_REGEN_MAX_POLL_ATTEMPTS as MAX_POLL_ATTEMPTS,
	AUDIO_REGEN_POLL_BACKOFF_MS as POLL_BACKOFF_MS,
} from "~/modules/admin/games/true-false/libs/constants/audio-regen.constant";

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

		const run = vi.fn().mockResolvedValue();
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
			await vi.advanceTimersByTimeAsync(POLL_BACKOFF_MS);
			await pending;
		});

		expect(run).toHaveBeenCalledTimes(1);
		expect(refresh).toHaveBeenCalledTimes(1);
		expect(result.current.isGenerating(KEY)).toBe(false);
	});

	it("stops polling after the bounded number of attempts when it stays stale", async () => {
		const { result } = renderHook(() => useAudioRegen());

		const run = vi.fn().mockResolvedValue();
		const refresh = vi.fn().mockResolvedValue();

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
			await vi.advanceTimersByTimeAsync(POLL_BACKOFF_MS * MAX_POLL_ATTEMPTS);
			await pending;
		});

		expect(refresh).toHaveBeenCalledTimes(MAX_POLL_ATTEMPTS);
		expect(result.current.isGenerating(KEY)).toBe(false);
	});

	it("clears the generating flag even when the request fails", async () => {
		const { result } = renderHook(() => useAudioRegen());

		const run = vi.fn().mockRejectedValue(new Error("nope"));
		const refresh = vi.fn().mockResolvedValue();

		await act(async () => {
			await expect(
				result.current.regenerate({ isStillStale: () => true, key: KEY, refresh, run })
			).rejects.toThrow("nope");
		});

		expect(refresh).not.toHaveBeenCalled();
		expect(result.current.isGenerating(KEY)).toBe(false);
	});
});
