import { describe, expect, it } from "vitest";

import { buildTrueFalseLevelFormData } from "~/modules/admin/games/true-false/libs/helpers/build-true-false-level-form-data.helper";

const buildImage = (): File => new File(["png"], "cover.png", { type: "image/png" });

describe("buildTrueFalseLevelFormData", () => {
	const title = { en: "Title EN", es: "Title ES", uk: "Заголовок" };
	const text = { en: "Body EN", es: "Body ES", uk: "Текст" };

	it("appends localized title fields", () => {
		const formData = buildTrueFalseLevelFormData({ title }, "POST");

		expect(formData.get("title[uk]")).toBe("Заголовок");
		expect(formData.get("title[en]")).toBe("Title EN");
		expect(formData.get("title[es]")).toBe("Title ES");
	});

	it("appends text fields only when provided", () => {
		expect(buildTrueFalseLevelFormData({ title }, "POST").get("text[en]")).toBeNull();

		const withText = buildTrueFalseLevelFormData({ text, title }, "POST");
		expect(withText.get("text[en]")).toBe("Body EN");
		expect(withText.get("text[uk]")).toBe("Текст");
	});

	it("omits the image when not provided and includes it when present", () => {
		expect(buildTrueFalseLevelFormData({ title }, "POST").get("image")).toBeNull();

		const withImage = buildTrueFalseLevelFormData({ image: buildImage(), title }, "POST");
		expect(withImage.get("image")).toBeInstanceOf(File);
	});

	it("spoofs PATCH via _method on POST so the file part survives", () => {
		expect(buildTrueFalseLevelFormData({ title }, "POST").get("_method")).toBeNull();
		expect(buildTrueFalseLevelFormData({ title }, "PATCH").get("_method")).toBe("PATCH");
	});
});
