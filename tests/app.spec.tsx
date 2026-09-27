import type * as routerDom from "react-router-dom";

/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DataStatus } from "~/libs/enums/enums";

const { mockDispatch, mockGetAuthenticatedUserAction, mockGetEntitlementAction } = vi.hoisted(
	() => ({
		mockDispatch: vi.fn(() => Promise.resolve()),
		mockGetAuthenticatedUserAction: { type: "auth/getAuthenticatedUser" },
		mockGetEntitlementAction: { type: "entitlement/getEntitlement" },
	})
);

vi.mock("~/libs/hooks/use-app-dispatch/use-app-dispatch.hook", () => ({
	useAppDispatch: () => mockDispatch,
}));

vi.mock("~/libs/hooks/use-app-selector/use-app-selector.hook", () => ({
	useAppSelector: vi.fn(),
}));

vi.mock("~/modules/auth/auth", () => ({
	getAuthenticatedUser: vi.fn(() => mockGetAuthenticatedUserAction),
}));

vi.mock("~/modules/entitlement/entitlement", () => ({
	getEntitlement: vi.fn(() => mockGetEntitlementAction),
}));

vi.mock("sonner", () => ({ Toaster: (): null => null }));

vi.mock("react-router-dom", async (importOriginal) => {
	const actual = await importOriginal<typeof routerDom>();

	return { ...actual, Outlet: (): null => null, ScrollRestoration: (): null => null };
});

import { App } from "~/app";
import { useAppSelector } from "~/libs/hooks/use-app-selector/use-app-selector.hook";

const mockUseAppSelector = vi.mocked(useAppSelector);

type EntitlementStatus = (typeof DataStatus)[keyof typeof DataStatus];

const USER = { email: "test@example.com", has_password: true, id: 1, is_admin: false, name: "Test User" };

const renderApp = ({
	entitlementStatus,
	user,
}: {
	entitlementStatus: EntitlementStatus;
	user: null | typeof USER;
}): void => {
	mockUseAppSelector.mockImplementation((selector: unknown) =>
		(selector as (root: unknown) => unknown)({
			auth: { dataStatus: user ? DataStatus.FULFILLED : DataStatus.IDLE, user },
			entitlement: { dataStatus: entitlementStatus },
		})
	);

	render(<App />);
};

describe("App", () => {
	beforeEach(() => {
		mockDispatch.mockClear();
	});

	it("fetches entitlement once for a signed-in account that has not asked yet", () => {
		renderApp({ entitlementStatus: DataStatus.IDLE, user: USER });

		expect(mockDispatch).toHaveBeenCalledTimes(1);
		expect(mockDispatch).toHaveBeenCalledWith(mockGetEntitlementAction);
	});

	it("does not fetch entitlement for a visitor who is not signed in", () => {
		renderApp({ entitlementStatus: DataStatus.IDLE, user: null });

		expect(mockDispatch).not.toHaveBeenCalledWith(mockGetEntitlementAction);
	});

	it("does not fetch again once a snapshot is in hand", () => {
		renderApp({ entitlementStatus: DataStatus.FULFILLED, user: USER });

		expect(mockDispatch).not.toHaveBeenCalledWith(mockGetEntitlementAction);
	});

	// A refusal is terminal for the session: retrying here would loop through
	// rejected → effect → pending → rejected with nobody asking for it. The
	// recovery belongs to whoever renders the allowances, which is why the hook
	// reports isError for exactly this state.
	it("does not retry a refusal on its own", () => {
		renderApp({ entitlementStatus: DataStatus.REJECTED, user: USER });

		expect(mockDispatch).not.toHaveBeenCalledWith(mockGetEntitlementAction);
	});
});
