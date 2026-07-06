// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import { router } from "~/libs/components/router-provider/router-provider";
import { AppRoute } from "~/libs/enums/enums";

const collectPaths = (routes: typeof router.routes): string[] =>
	routes.flatMap((route) => [
		...(route.path === undefined ? [] : [route.path]),
		...(route.children ? collectPaths(route.children) : []),
	]);

describe("router", () => {
	it("nests the guest routes under the single App root so toasts and auth bootstrap cover them", () => {
		expect(router.routes).toHaveLength(1);
		expect(router.routes[0]?.path).toBe(AppRoute.ROOT);

		const paths = collectPaths(router.routes);

		expect(paths).toContain(AppRoute.LOGIN);
		expect(paths).toContain(AppRoute.REGISTER);
		expect(paths).toContain(AppRoute.AUTH_GOOGLE_CALLBACK);
	});
});
