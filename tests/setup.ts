import { vi } from "vitest";

Object.defineProperty(navigator, "onLine", { configurable: true, value: true });
Element.prototype.scrollIntoView = vi.fn();
