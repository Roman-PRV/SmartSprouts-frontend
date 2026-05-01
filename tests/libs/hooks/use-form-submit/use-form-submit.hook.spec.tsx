/**
 * @vitest-environment jsdom
 */
import { configureStore } from "@reduxjs/toolkit";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useFormSubmit } from "~/libs/hooks/use-form-submit/use-form-submit.hook";

describe("useFormSubmit", () => {
	const createMockStore = () => {
		return configureStore({
			reducer: {
				_: (state = null) => state,
			},
		});
	};

	const wrapper = ({ children }: { children: React.ReactNode }) => {
		const store = createMockStore();
		return <Provider store={store}>{children}</Provider>;
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("calls onSuccess after a fulfilled action", async () => {
		const mockAction = vi.fn().mockReturnValue({
			type: "test/action",
			payload: {},
			meta: { requestStatus: "fulfilled" },
		});
		const onSuccess = vi.fn();
		const setError = vi.fn();

		const { result } = renderHook(
			() =>
				useFormSubmit({
					action: mockAction,
					onSuccess,
					setError,
				}),
			{ wrapper },
		);

		await result.current({ username: "test" });

		expect(onSuccess).toHaveBeenCalled();
	});

	it("does not call onError after a fulfilled action", async () => {
		const mockAction = vi.fn().mockReturnValue({
			type: "test/action",
			payload: {},
			meta: { requestStatus: "fulfilled" },
		});
		const onError = vi.fn();
		const setError = vi.fn();

		const { result } = renderHook(
			() =>
				useFormSubmit({
					action: mockAction,
					onError,
					setError,
				}),
			{ wrapper },
		);

		await result.current({});

		expect(onError).not.toHaveBeenCalled();
	});

	it("does not call onSuccess when action is rejected", async () => {
		const mockAction = vi.fn().mockReturnValue({
			type: "test/action",
			payload: null,
			meta: { requestStatus: "rejected" },
		});
		const onSuccess = vi.fn();
		const setError = vi.fn();

		const { result } = renderHook(
			() =>
				useFormSubmit({
					action: mockAction,
					onSuccess,
					setError,
				}),
			{ wrapper },
		);

		await result.current({});

		expect(onSuccess).not.toHaveBeenCalled();
	});

	it("calls onError when action is rejected without field errors", async () => {
		const mockAction = vi.fn().mockReturnValue({
			type: "test/action",
			payload: null,
			meta: { requestStatus: "rejected" },
		});
		const onError = vi.fn();
		const setError = vi.fn();

		const { result } = renderHook(
			() =>
				useFormSubmit({
					action: mockAction,
					onError,
					setError,
				}),
			{ wrapper },
		);

		await result.current({});

		expect(onError).toHaveBeenCalled();
	});

	it("maps backend errors to matching form fields", async () => {
		const backendErrors = {
			email: ["Email already exists"],
			password: ["Password too short"],
		};
		const mockAction = vi.fn().mockReturnValue({
			type: "test/action",
			payload: { errors: backendErrors },
			meta: { requestStatus: "rejected" },
		});
		const onError = vi.fn();
		const setError = vi.fn();
		const payload = { email: "", password: "" };

		const { result } = renderHook(
			() =>
				useFormSubmit({
					action: mockAction,
					onError,
					setError,
				}),
			{ wrapper },
		);

		await result.current(payload);

		expect(setError).toHaveBeenCalledWith("email", {
			message: "Email already exists",
		});
		expect(setError).toHaveBeenCalledWith("password", {
			message: "Password too short",
		});
	});

	it("does not call onError when field errors are mapped", async () => {
		const backendErrors = {
			email: ["Email already exists"],
		};
		const mockAction = vi.fn().mockReturnValue({
			type: "test/action",
			payload: { errors: backendErrors },
			meta: { requestStatus: "rejected" },
		});
		const onError = vi.fn();
		const setError = vi.fn();
		const payload = { email: "" };

		const { result } = renderHook(
			() =>
				useFormSubmit({
					action: mockAction,
					onError,
					setError,
				}),
			{ wrapper },
		);

		await result.current(payload);

		expect(onError).not.toHaveBeenCalled();
	});

	it("does not set error for fields not present in the payload", async () => {
		const backendErrors = {
			unknownField: ["Some error"],
		};
		const mockAction = vi.fn().mockReturnValue({
			type: "test/action",
			payload: { errors: backendErrors },
			meta: { requestStatus: "rejected" },
		});
		const setError = vi.fn();
		const payload = { email: "" };

		const { result } = renderHook(
			() =>
				useFormSubmit({
					action: mockAction,
					setError,
				}),
			{ wrapper },
		);

		await result.current(payload);

		expect(setError).not.toHaveBeenCalled();
	});

	it("calls onError when all rejected errors have unrecognized field names", async () => {
		const backendErrors = {
			unknownField: ["Some error"],
		};
		const mockAction = vi.fn().mockReturnValue({
			type: "test/action",
			payload: { errors: backendErrors },
			meta: { requestStatus: "rejected" },
		});
		const onError = vi.fn();
		const setError = vi.fn();
		const payload = { email: "" };

		const { result } = renderHook(
			() =>
				useFormSubmit({
					action: mockAction,
					onError,
					setError,
				}),
			{ wrapper },
		);

		await result.current(payload);

		expect(onError).toHaveBeenCalled();
	});

	it("uses the first error message from the messages array", async () => {
		const backendErrors = {
			email: ["First error", "Second error"],
		};
		const mockAction = vi.fn().mockReturnValue({
			type: "test/action",
			payload: { errors: backendErrors },
			meta: { requestStatus: "rejected" },
		});
		const setError = vi.fn();
		const payload = { email: "" };

		const { result } = renderHook(
			() =>
				useFormSubmit({
					action: mockAction,
					setError,
				}),
			{ wrapper },
		);

		await result.current(payload);

		expect(setError).toHaveBeenCalledWith("email", { message: "First error" });
	});

	it("falls back to 'validation.error' when the messages array is empty", async () => {
		const backendErrors = {
			email: [],
		};
		const mockAction = vi.fn().mockReturnValue({
			type: "test/action",
			payload: { errors: backendErrors },
			meta: { requestStatus: "rejected" },
		});
		const setError = vi.fn();
		const payload = { email: "" };

		const { result } = renderHook(
			() =>
				useFormSubmit({
					action: mockAction,
					setError,
				}),
			{ wrapper },
		);

		await result.current(payload);

		expect(setError).toHaveBeenCalledWith("email", {
			message: "validation.error",
		});
	});

	it("dispatches the action with the provided payload", async () => {
		const payload = { username: "testuser", password: "pass123" };
		const mockAction = vi.fn().mockReturnValue({
			type: "test/action",
			payload: {},
			meta: { requestStatus: "fulfilled" },
		});
		const setError = vi.fn();

		const { result } = renderHook(
			() =>
				useFormSubmit({
					action: mockAction,
					setError,
				}),
			{ wrapper },
		);

		await result.current(payload);

		expect(mockAction).toHaveBeenCalledWith(payload);
	});
});
