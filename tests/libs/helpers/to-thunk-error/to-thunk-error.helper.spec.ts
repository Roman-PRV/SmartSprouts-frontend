import { describe, expect, it } from "vitest";

import { toThunkError } from "~/libs/helpers/to-thunk-error/to-thunk-error.helper";

describe("toThunkError", () => {
	it("prefers the server-provided payload", () => {
		const result = toThunkError({
			error: { message: "serialized" },
			payload: { message: "from server" },
		});

		expect(result).toEqual({ message: "from server" });
	});

	it("falls back to the serialized error message when there is no payload", () => {
		const result = toThunkError({ error: { message: "serialized" }, payload: undefined });

		expect(result).toEqual({ message: "serialized" });
	});

	it("returns null when neither a payload nor an error message exists", () => {
		expect(toThunkError({ error: {}, payload: undefined })).toBeNull();
		expect(toThunkError({ error: {}, payload: null })).toBeNull();
	});
});
