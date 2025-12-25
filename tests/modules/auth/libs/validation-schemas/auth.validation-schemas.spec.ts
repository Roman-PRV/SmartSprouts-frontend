import { describe, expect, it } from "vitest";

import { FIRST_INDEX, VALIDATION_MESSAGES } from "~/libs/constants/constants";
import {
	loginSchema,
	registerSchema,
} from "~/modules/auth/libs/validation-schemas/auth.validation-schemas";

describe("Auth Validation Schemas", () => {
	describe("loginSchema", () => {
		it("should validate correct login data", () => {
			const data = {
				email: "test@example.com",
				password: "password123",
			};
			const result = loginSchema.safeParse(data);
			expect(result.success).toBe(true);
		});

		it("should fail for invalid email", () => {
			const data = {
				email: "invalid-email",
				password: "password123",
			};
			const result = loginSchema.safeParse(data);

			expect(result.success).toBe(false);

			if (!result.success) {
				const issue = result.error.issues.find((i) => i.path[FIRST_INDEX] === "email");
				expect(issue?.message).toBe(VALIDATION_MESSAGES.INVALID_EMAIL_FORMAT);
			}
		});
	});

	describe("registerSchema", () => {
		it("should validate correct registration data", () => {
			const data = {
				email: "test@example.com",
				name: "Test User",
				password: "password123",
				password_confirmation: "password123",
			};
			const result = registerSchema.safeParse(data);
			expect(result.success).toBe(true);
		});

		it("should fail if passwords do not match", () => {
			const data = {
				email: "test@example.com",
				name: "Test User",
				password: "password123",
				password_confirmation: "password456",
			};
			const result = registerSchema.safeParse(data);

			expect(result.success).toBe(false);

			if (!result.success) {
				const issue = result.error.issues.find(
					(i) => i.path[FIRST_INDEX] === "password_confirmation"
				);
				expect(issue?.message).toBe(VALIDATION_MESSAGES.PW_DO_NOT_MATCH);
			}
		});

		it("should fail validation for individual fields", () => {
			const data = {
				email: "invalid",
				name: "",
				password: "short",
				password_confirmation: "short",
			};
			const result = registerSchema.safeParse(data);
			expect(result.success).toBe(false);
		});
	});
});
