import { describe, expect, it } from "vitest";
import { z } from "zod";

import { validateFormData } from "~/libs/helpers/helpers";

describe("validateFormData", () => {
	it("should return data and null errors for valid data", () => {
		const schema = z.object({
			email: z.string().email(),
			name: z.string().min(1),
		});
		const data = {
			email: "test@example.com",
			name: "Test User",
		};

		const result = validateFormData(data, schema);

		expect(result).toEqual({
			data: {
				email: "test@example.com",
				name: "Test User",
			},
			errors: null,
		});
	});

	it("should return transformed data for valid data with transformations", () => {
		const schema = z.object({
			email: z.string().trim().toLowerCase().pipe(z.string().email()),
			name: z.string().trim(),
		});
		const data = {
			email: "  Test@Example.Com  ",
			name: "  Test User  ",
		};

		const result = validateFormData(data, schema);

		expect(result).toEqual({
			data: {
				email: "test@example.com",
				name: "Test User",
			},
			errors: null,
		});
	});

	it("should return error record and null data for invalid data", () => {
		const schema = z.object({
			email: z.string().email("Invalid email"),
			name: z.string().min(1, "Name is required"),
		});
		const data = {
			email: "invalid-email",
			name: "",
		};

		const result = validateFormData(data, schema);

		expect(result).toEqual({
			data: null,
			errors: {
				email: "Invalid email",
				name: "Name is required",
			},
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

		const result = validateFormData(data, schema);

		expect(result).toEqual({
			data: null,
			errors: {
				"user.details.age": "Too young",
			},
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

		const result = validateFormData(data, schema);

		expect(result).toEqual({
			data: null,
			errors: {
				"": "Passwords must match",
			},
		});
	});
});
