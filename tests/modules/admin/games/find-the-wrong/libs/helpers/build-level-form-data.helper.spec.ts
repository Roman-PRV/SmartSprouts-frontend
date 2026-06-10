import { describe, expect, it } from "vitest";

import { buildLevelFormData } from "~/modules/admin/games/find-the-wrong/libs/helpers/build-level-form-data.helper";

const TEXT_FILE_TYPE = "image/png";

const buildFile = (): File => new File(["png"], "bg.png", { type: TEXT_FILE_TYPE });

describe("buildLevelFormData", () => {
	const baseInput = {
		title: { en: "Title EN", es: "Title ES", uk: "Заголовок" },
	};

	describe("POST", () => {
		it("appends localized title fields", () => {
			const formData = buildLevelFormData(baseInput, "POST");

			expect(formData.get("title[uk]")).toBe("Заголовок");
			expect(formData.get("title[en]")).toBe("Title EN");
			expect(formData.get("title[es]")).toBe("Title ES");
		});

		it("does not append _method override", () => {
			const formData = buildLevelFormData(baseInput, "POST");

			expect(formData.get("_method")).toBeNull();
		});

		it("appends image when provided", () => {
			const image = buildFile();
			const formData = buildLevelFormData({ ...baseInput, image }, "POST");

			const appended = formData.get("image");
			expect(appended).toBeInstanceOf(File);
			expect((appended as File).name).toBe("bg.png");
		});

		it("omits image when not provided", () => {
			const formData = buildLevelFormData(baseInput, "POST");

			expect(formData.get("image")).toBeNull();
		});
	});

	describe("PATCH", () => {
		it("includes _method=PATCH override", () => {
			const formData = buildLevelFormData(baseInput, "PATCH");

			expect(formData.get("_method")).toBe("PATCH");
		});

		it("still appends localized title fields", () => {
			const formData = buildLevelFormData(baseInput, "PATCH");

			expect(formData.get("title[uk]")).toBe("Заголовок");
			expect(formData.get("title[en]")).toBe("Title EN");
			expect(formData.get("title[es]")).toBe("Title ES");
		});

		it("appends image when present", () => {
			const image = buildFile();
			const formData = buildLevelFormData({ ...baseInput, image }, "PATCH");

			expect(formData.get("image")).toBeInstanceOf(File);
		});
	});
});
