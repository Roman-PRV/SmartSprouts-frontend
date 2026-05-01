import { describe, expect, it } from "vitest";

import { FIRST_INDEX, VALIDATION_MESSAGES } from "~/libs/constants/constants";
import { updatePasswordValidationSchema } from "~/modules/profile/libs/validation-schemas/update-password.validation-schema";

describe("updatePasswordValidationSchema", () => {
	it("should pass with valid data", () => {
		const result = updatePasswordValidationSchema.safeParse({
			current_password: "OldPassword1",
			new_password: "NewPassword1",
			new_password_confirmation: "NewPassword1",
		});

		expect(result.success).toBe(true);
	});

	it("should fail when current_password is empty", () => {
		const result = updatePasswordValidationSchema.safeParse({
			current_password: "",
			new_password: "NewPassword1",
			new_password_confirmation: "NewPassword1",
		});

		expect(result.success).toBe(false);

		if (!result.success) {
			const issue = result.error.issues.find(
				(i) => i.path[FIRST_INDEX] === "current_password",
			);
			expect(issue?.message).toBe(VALIDATION_MESSAGES.PW_REQUIRED);
		}
	});

	it("should fail when new_password_confirmation is empty", () => {
		const result = updatePasswordValidationSchema.safeParse({
			current_password: "OldPassword1",
			new_password: "NewPassword1",
			new_password_confirmation: "",
		});

		expect(result.success).toBe(false);

		if (!result.success) {
			const issue = result.error.issues.find(
				(i) => i.path[FIRST_INDEX] === "new_password_confirmation",
			);
			expect(issue?.message).toBe(VALIDATION_MESSAGES.PW_REQUIRED);
		}
	});

	it("should fail when new_password is too short", () => {
		const result = updatePasswordValidationSchema.safeParse({
			current_password: "OldPassword1",
			new_password: "Short1A",
			new_password_confirmation: "Short1A",
		});

		expect(result.success).toBe(false);

		if (!result.success) {
			const issue = result.error.issues.find(
				(i) => i.path[FIRST_INDEX] === "new_password",
			);
			expect(issue?.message).toBe(VALIDATION_MESSAGES.MIN_PW_LENGTH);
		}
	});

	it("should fail when new_password does not contain a number", () => {
		const result = updatePasswordValidationSchema.safeParse({
			current_password: "OldPassword1",
			new_password: "NewPassword",
			new_password_confirmation: "NewPassword",
		});

		expect(result.success).toBe(false);

		if (!result.success) {
			const issue = result.error.issues.find(
				(i) => i.path[FIRST_INDEX] === "new_password",
			);
			expect(issue?.message).toBe(VALIDATION_MESSAGES.PW_CONTAINS_NUMBER);
		}
	});

	it("should fail when new_password does not contain an uppercase letter", () => {
		const result = updatePasswordValidationSchema.safeParse({
			current_password: "OldPassword1",
			new_password: "newpassword1",
			new_password_confirmation: "newpassword1",
		});

		expect(result.success).toBe(false);

		if (!result.success) {
			const issue = result.error.issues.find(
				(i) => i.path[FIRST_INDEX] === "new_password",
			);
			expect(issue?.message).toBe(VALIDATION_MESSAGES.PW_CONTAINS_UPPERCASE);
		}
	});

	it("should fail when new_password does not contain a lowercase letter", () => {
		const result = updatePasswordValidationSchema.safeParse({
			current_password: "OldPassword1",
			new_password: "NEWPASSWORD1",
			new_password_confirmation: "NEWPASSWORD1",
		});

		expect(result.success).toBe(false);

		if (!result.success) {
			const issue = result.error.issues.find(
				(i) => i.path[FIRST_INDEX] === "new_password",
			);
			expect(issue?.message).toBe(VALIDATION_MESSAGES.PW_CONTAINS_LOWERCASE);
		}
	});

	it("should fail when new_password_confirmation does not match new_password", () => {
		const result = updatePasswordValidationSchema.safeParse({
			current_password: "OldPassword1",
			new_password: "NewPassword1",
			new_password_confirmation: "DifferentPassword1",
		});

		expect(result.success).toBe(false);

		if (!result.success) {
			const issue = result.error.issues.find(
				(i) => i.path[FIRST_INDEX] === "new_password_confirmation",
			);
			expect(issue?.message).toBe(VALIDATION_MESSAGES.PW_DO_NOT_MATCH);
		}
	});

	it("should fail when new_password is the same as current_password", () => {
		const result = updatePasswordValidationSchema.safeParse({
			current_password: "SamePassword1",
			new_password: "SamePassword1",
			new_password_confirmation: "SamePassword1",
		});

		expect(result.success).toBe(false);

		if (!result.success) {
			const issue = result.error.issues.find(
				(i) => i.path[FIRST_INDEX] === "new_password",
			);
			expect(issue?.message).toBe(VALIDATION_MESSAGES.PW_MUST_BE_NEW);
		}
	});
});
