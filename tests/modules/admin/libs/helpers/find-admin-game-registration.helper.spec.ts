import { describe, expect, it } from "vitest";

import { GameKey } from "~/libs/enums/enums";
import { findAdminGameRegistration } from "~/modules/admin/libs/helpers/find-admin-game-registration.helper";

describe("findAdminGameRegistration", () => {
	it("returns the registration for an admin-supported game key", () => {
		const registration = findAdminGameRegistration(GameKey.FIND_THE_WRONG);

		expect(registration).not.toBeNull();
		expect(registration?.gameKey).toBe(GameKey.FIND_THE_WRONG);
		expect(typeof registration?.EditorSection).toBe("function");
		expect(typeof registration?.LevelsListSection).toBe("function");
	});

	it("returns null for a game key without admin support", () => {
		expect(findAdminGameRegistration(GameKey.MULTIPLICATION_TABLE)).toBeNull();
	});

	it("returns null for an unknown game key", () => {
		expect(findAdminGameRegistration("unknown_game")).toBeNull();
	});
});
