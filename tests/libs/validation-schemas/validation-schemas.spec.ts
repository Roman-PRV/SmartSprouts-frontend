import { describe, expect, it } from "vitest";

import { VALIDATION_MESSAGES } from "~/libs/constants/validation.constants";
import {
	emailSchema,
	nameSchema,
	passwordSchema,
} from "~/libs/validation-schemas/validation-schemas";

describe("Validation Schemas", () => {
	describe("emailSchema", () => {
		it("should validate correct email", () => {
			const result = emailSchema.safeParse("test@example.com");
			expect(result.success).toBe(true);
		});

		it("should validate email with whitespace (trimming)", () => {
			const result = emailSchema.safeParse("  test@example.com  ");
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toBe("test@example.com");
			}
		});

		it("should fail for invalid email format", () => {
			const result = emailSchema.safeParse("invalid-email");
			if (result.success) {
				expect(result.success).toBe(false);
				return;
			}
			expect(result.error.issues[0]?.message).toBe(
				VALIDATION_MESSAGES.INVALID_EMAIL_FORMAT
			);
		});

		it("should fail for empty string", () => {
			const result = emailSchema.safeParse("");
			expect(result.success).toBe(false);
		});
	});

	describe("nameSchema", () => {
		it("should validate correct name", () => {
			const result = nameSchema.safeParse("John Doe");
			expect(result.success).toBe(true);
		});

		it("should validate name with whitespace (trimming)", () => {
			const result = nameSchema.safeParse("  John  ");
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toBe("John");
			}
		});

		it("should fail for empty string", () => {
			const result = nameSchema.safeParse("");
			if (result.success) {
				expect(result.success).toBe(false);
				return;
			}
			expect(result.error.issues[0]?.message).toBe(
				VALIDATION_MESSAGES.MIN_NAME_LENGTH
			);
		});
	});

	describe("passwordSchema", () => {
		it("should validate correct password", () => {
			const result = passwordSchema.safeParse("password123");
			expect(result.success).toBe(true);
		});

		it("should fail if password is too short", () => {
			const result = passwordSchema.safeParse("12345");
			if (result.success) {
				expect(result.success).toBe(false);
				return;
			}
			expect(result.error.issues[0]?.message).toBe(
				VALIDATION_MESSAGES.MIN_PW_LENGTH
			);
		});

		it("should fail if password does not contain a number", () => {
			const result = passwordSchema.safeParse("password");
			if (result.success) {
				expect(result.success).toBe(false);
				return;
			}
			const issue = result.error.issues.find(
				(i) => i.message === VALIDATION_MESSAGES.PW_CONTAINS_NUMBER
			);
			expect(issue).toBeDefined();
		});
	});
});
