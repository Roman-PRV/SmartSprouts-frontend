/**
 * @vitest-environment jsdom
 */
import { configureStore } from "@reduxjs/toolkit";
import { renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { actions as authActions } from "~/modules/auth/auth";
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

    it("dispatches clearError before calling the action", async () => {
        const clearErrorSpy = vi.spyOn(authActions, "clearError");
        const mockAction = vi.fn().mockReturnValue({
            type: "auth/test",
            payload: {},
            meta: { requestStatus: "fulfilled" },
        });
        const setError = vi.fn();
        const payload = { email: "test@test.com" };

        const { result } = renderHook(
            () =>
                useAuthFormSubmit({
                    action: mockAction,
                    setError,
                }),
            { wrapper }
        );

        await result.current(payload);

        expect(clearErrorSpy).toHaveBeenCalled();
        expect(mockAction).toHaveBeenCalledWith(payload);
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

    it("maps backend errors to form fields correctly", async () => {
        const backendErrors = {
            email: ["Email already exists"],
            password: ["Password too short"],
        };
        const mockAction = vi.fn().mockReturnValue({
            type: "auth/test",
            payload: { errors: backendErrors },
            meta: { requestStatus: "rejected" },
        });
        const setError = vi.fn();
        const payload = { email: "", password: "" };

        const { result } = renderHook(
            () =>
                useAuthFormSubmit({
                    action: mockAction,
                    setError,
                }),
            { wrapper }
        );

        await result.current(payload);

        expect(setError).toHaveBeenCalledWith("email", {
            message: "Email already exists",
        });
        expect(setError).toHaveBeenCalledWith("password", {
            message: "Password too short",
        });
    });

    it("does not map errors for fields not present in payload", async () => {
        const backendErrors = {
            unknownField: ["Some error"],
        };
        const mockAction = vi.fn().mockReturnValue({
            type: "auth/test",
            payload: { errors: backendErrors },
            meta: { requestStatus: "rejected" },
        });
        const setError = vi.fn();
        const payload = { email: "" };

        const { result } = renderHook(
            () =>
                useAuthFormSubmit({
                    action: mockAction,
                    setError,
                }),
            { wrapper }
        );

        await result.current(payload);

        expect(setError).not.toHaveBeenCalled();
    });
});
