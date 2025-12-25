import { describe, expect, it } from "vitest";
import { z } from "zod";

import { getFormValidationErrors } from "~/libs/helpers/helpers";

describe("getFormValidationErrors", () => {
	it("should return null for valid data", () => {
		const schema = z.object({
			email: z.string().email(),
			name: z.string().min(1),
		});
		const data = {
			email: "test@example.com",
			name: "Test User",
		};

		const result = getFormValidationErrors(data, schema);

		expect(result).toBeNull();
	});

	it("should return error record for invalid data", () => {
		const schema = z.object({
			email: z.string().email("Invalid email"),
			name: z.string().min(1, "Name is required"),
		});
		const data = {
			email: "invalid-email",
			name: "",
		};

		const result = getFormValidationErrors(data, schema);

		expect(result).toEqual({
			email: "Invalid email",
			name: "Name is required",
		});
	});

	it("should handle nested object validation", () => {
		const schema = z.object({
			user: z.object({
				details: z.object({
					age: z.number().min(18, "Too young"),
				}),
			}),
		});
		const data = {
			user: {
				details: {
					age: 16,
				},
			},
		};

		const result = getFormValidationErrors(data, schema);

		expect(result).toEqual({
			"user.details.age": "Too young",
		});
	});

	it("should return error record for root-level validation errors", () => {
		const schema = z
			.object({
				password: z.string(),
				confirmPassword: z.string(),
			})
			.refine((data) => data.password === data.confirmPassword, {
				message: "Passwords must match",
				path: [],
			});
		const data = {
			password: "password123",
			confirmPassword: "password456",
		};

		const result = getFormValidationErrors(data, schema);

		expect(result).toEqual({
			"": "Passwords must match",
		});
	});
});
