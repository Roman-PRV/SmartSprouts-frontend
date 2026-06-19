import { describe, expect, it } from "vitest";

import { extractFileName } from "~/libs/helpers/extract-file-name/extract-file-name.helper";

describe("extractFileName", () => {
	it("returns null for null input", () => {
		expect(extractFileName(null)).toBeNull();
	});

	it("returns null for empty string", () => {
		expect(extractFileName("")).toBeNull();
	});

	it("returns the segment after the last slash", () => {
		expect(extractFileName("/storage/levels/1/image.png")).toBe("image.png");
	});

	it("drops query string before parsing", () => {
		expect(extractFileName("/storage/levels/1/image.png?token=abc")).toBe("image.png");
	});

	it("handles fully-qualified URLs", () => {
		expect(extractFileName("https://cdn.example.com/files/photo.jpeg")).toBe("photo.jpeg");
	});

	it("returns input itself when no slash present", () => {
		expect(extractFileName("image.png")).toBe("image.png");
	});

	it("returns null when URL ends with a trailing slash", () => {
		expect(extractFileName("/storage/levels/1/")).toBeNull();
	});

	it("returns null when path resolves to only a query string", () => {
		expect(extractFileName("?token=abc")).toBeNull();
	});
});
