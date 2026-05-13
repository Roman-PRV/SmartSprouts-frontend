/**
 * @vitest-environment jsdom
 */
import { configureStore } from "@reduxjs/toolkit";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthFormSubmit } from "~/modules/auth/hooks/use-auth-form-submit/use-auth-form-submit.hook";
import { reducer as authReducer } from "~/modules/auth/slices/auth.slice";

describe("useAuthFormSubmit", () => {
	const createMockStore = () => {
		return configureStore({
			reducer: {
				auth: authReducer,
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

	it("calls onSuccess after successful submission", async () => {
		const mockAction = vi.fn().mockReturnValue({
			type: "auth/test",
			payload: {},
			meta: { requestStatus: "fulfilled" },
		});
		const onSuccess = vi.fn();
		const setError = vi.fn();

		const { result } = renderHook(
			() =>
				useAuthFormSubmit({
					action: mockAction,
					onSuccess,
					setError,
				}),
			{ wrapper }
		);

		await result.current({});

		expect(onSuccess).toHaveBeenCalled();
	});
});
