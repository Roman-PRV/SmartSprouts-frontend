import { vi } from "vitest";

if (typeof navigator !== "undefined") {
	Object.defineProperty(navigator, "onLine", { configurable: true, value: true });
}

if (typeof Element !== "undefined") {
	Element.prototype.scrollIntoView = vi.fn();
}
