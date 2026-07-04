import { describe, expect, it } from "vitest";

import { deriveAudioState } from "~/modules/admin/games/true-false/libs/helpers/derive-audio-state.helper";

describe("deriveAudioState", () => {
	it("returns 'generating' regardless of status when a request is in flight", () => {
		expect(deriveAudioState({ is_stale: true, url: "a.mp3" }, true)).toBe("generating");
		expect(deriveAudioState(undefined, true)).toBe("generating");
	});

	it("returns 'missing' when the status entry is absent", () => {
		expect(deriveAudioState(undefined, false)).toBe("missing");
	});

	it("returns 'missing' when the url is null even if not stale", () => {
		expect(deriveAudioState({ is_stale: false, url: null }, false)).toBe("missing");
	});

	it("returns 'stale' when the backend reports staleness and audio exists", () => {
		expect(deriveAudioState({ is_stale: true, url: "a.mp3" }, false)).toBe("stale");
	});

	it("returns 'fresh' when audio exists and is not stale", () => {
		expect(deriveAudioState({ is_stale: false, url: "a.mp3" }, false)).toBe("fresh");
	});
});
