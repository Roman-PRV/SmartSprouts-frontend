/**
 * @vitest-environment jsdom
 */
import { configureStore } from "@reduxjs/toolkit";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { useNavigate } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useLogout } from "~/modules/auth/hooks/use-logout/use-logout.hook";
import { logout } from "~/modules/auth/slices/actions";
import { reducer as authReducer } from "~/modules/auth/slices/auth.slice";

vi.mock("react-router-dom", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react-router-dom")>();
	return {
		...actual,
		useNavigate: vi.fn().mockReturnValue(vi.fn()),
	};
});

vi.mock("~/modules/auth/slices/actions", async (importOriginal) => {
	const actual = await importOriginal<typeof import("~/modules/auth/slices/actions")>();
	const mockLogout = vi.fn();
	Object.assign(mockLogout, actual.logout);
	return {
		...actual,
		logout: mockLogout,
	};
});

describe("useLogout", () => {
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

	it("should dispatch logout action", async () => {
		const mockLogoutAction = vi.fn().mockImplementation(() => ({
			unwrap: vi.fn().mockResolvedValue(undefined),
		}));
		vi.mocked(logout).mockReturnValue(mockLogoutAction as any);

		const { result } = renderHook(() => useLogout(), { wrapper });

		await result.current.logout();

		expect(logout).toHaveBeenCalled();
	});

	it("should navigate to /login after logout", async () => {
		const mockNavigate = vi.fn();
		vi.mocked(useNavigate).mockReturnValue(mockNavigate);

		const mockLogoutAction = vi.fn().mockImplementation(() => ({
			unwrap: vi.fn().mockResolvedValue(undefined),
		}));
		vi.mocked(logout).mockReturnValue(mockLogoutAction as any);

		const { result } = renderHook(() => useLogout(), { wrapper });

		await result.current.logout();

		expect(mockNavigate).toHaveBeenCalledWith("/login");
	});

	it("should navigate to /login even if logout fails", async () => {
		const mockNavigate = vi.fn();
		vi.mocked(useNavigate).mockReturnValue(mockNavigate);

		const mockLogoutAction = vi.fn().mockImplementation(() => ({
			unwrap: vi.fn().mockRejectedValue(new Error("Logout failed")),
		}));
		vi.mocked(logout).mockReturnValue(mockLogoutAction as any);

		const { result } = renderHook(() => useLogout(), { wrapper });

		try {
			await result.current.logout();
		} catch (error) {
			// Expected error
		}

		expect(mockNavigate).toHaveBeenCalledWith("/login");
	});
});
