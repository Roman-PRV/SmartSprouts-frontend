// @vitest-environment jsdom
import { isValidElement } from "react";
import { describe, expect, it } from "vitest";

import { GuestRoute } from "~/libs/components/guest-route/guest-route";
import { ProtectedRoute } from "~/libs/components/protected-route/protected-route";
import { router } from "~/libs/components/router-provider/router-provider";
import { AppRoute } from "~/libs/enums/enums";

const collectPaths = (routes: typeof router.routes): string[] =>
	routes.flatMap((route) => [
		...(route.path === undefined ? [] : [route.path]),
		...(route.children ? collectPaths(route.children) : []),
	]);

type RouteNode = {
	children?: RouteNode[];
	element?: unknown;
	path?: string;
};

const isGuardElement = (element: unknown): boolean =>
	isValidElement(element) && (element.type === GuestRoute || element.type === ProtectedRoute);

const collectGuardedPaths = (routes: RouteNode[], guarded = false): string[] =>
	routes.flatMap((route) => {
		const isGuarded = guarded || isGuardElement(route.element);

		return [
			...(route.path === undefined || !isGuarded ? [] : [route.path]),
			...(route.children ? collectGuardedPaths(route.children, isGuarded) : []),
		];
	});

describe("router", () => {
	it("nests the guest routes under the single App root so toasts and auth bootstrap cover them", () => {
		expect(router.routes).toHaveLength(1);
		expect(router.routes[0]?.path).toBe(AppRoute.ROOT);

		const paths = collectPaths(router.routes);

		expect(paths).toContain(AppRoute.LOGIN);
		expect(paths).toContain(AppRoute.REGISTER);
		expect(paths).toContain(AppRoute.AUTH_GOOGLE_CALLBACK);
	});

	it("keeps the legal pages outside both route guards so guests and authenticated users can read them", () => {
		const paths = collectPaths(router.routes);
		const guardedPaths = collectGuardedPaths(router.routes as RouteNode[]);

		expect(paths).toContain(AppRoute.PRIVACY);
		expect(paths).toContain(AppRoute.TERMS);
		expect(guardedPaths).not.toContain(AppRoute.PRIVACY);
		expect(guardedPaths).not.toContain(AppRoute.TERMS);
	});
});
