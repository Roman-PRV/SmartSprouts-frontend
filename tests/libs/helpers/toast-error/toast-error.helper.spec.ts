import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { toastError } from "~/libs/helpers/toast-error/toast-error.helper";

vi.mock("sonner", () => ({
	toast: { error: vi.fn() },
}));

describe("toastError", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("shows the toast for a normal error", () => {
		toastError({ message: "Boom" }, "Failed to delete");

		expect(toast.error).toHaveBeenCalledWith("Failed to delete");
	});

	it("stays silent for a session-expired error", () => {
		toastError({ message: "Unauthenticated.", sessionExpired: true }, "Failed to delete");

		expect(toast.error).not.toHaveBeenCalled();
	});
});
