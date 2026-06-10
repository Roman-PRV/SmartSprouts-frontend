import { describe, expect, it } from "vitest";

import { buildAdminEditorUrl } from "~/modules/admin/libs/helpers/build-admin-editor-url.helper";

describe("buildAdminEditorUrl", () => {
	it("replaces both placeholders with given ids", () => {
		const url = buildAdminEditorUrl("3", 42);

		expect(url).toBe("/admin/games/3/levels/42");
	});

	it("accepts a string gameId (matches GameDescriptionDto.id shape)", () => {
		const url = buildAdminEditorUrl("7", 1);

		expect(url).toBe("/admin/games/7/levels/1");
	});
});
