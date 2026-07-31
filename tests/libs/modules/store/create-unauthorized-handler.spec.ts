// @vitest-environment jsdom
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { storage, StorageKey } from "~/libs/modules/storage/storage";
import { createUnauthorizedHandler } from "~/libs/modules/store/create-unauthorized-handler";

vi.mock("sonner", () => ({
	toast: { info: vi.fn() },
}));

describe("createUnauthorizedHandler", () => {
	let dropMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.clearAllMocks();
		dropMock = vi.fn(() => Promise.resolve());
		vi.spyOn(storage, "drop").mockImplementation(dropMock);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("clears the token, resets the store, and notifies when a live session expired", () => {
		const dispatch = vi.fn();

		createUnauthorizedHandler({ dispatch, getIsAuthenticated: () => true })();

		expect(dropMock).toHaveBeenCalledWith(StorageKey.TOKEN);
		expect(dispatch).toHaveBeenCalledTimes(1);
		expect(toast.info).toHaveBeenCalledTimes(1);
	});

	it("clears the token silently at bootstrap (never authenticated this load)", () => {
		const dispatch = vi.fn();

		createUnauthorizedHandler({ dispatch, getIsAuthenticated: () => false })();

		expect(dropMock).toHaveBeenCalledWith(StorageKey.TOKEN);
		expect(dispatch).toHaveBeenCalledTimes(1);
		expect(toast.info).not.toHaveBeenCalled();
	});
});
