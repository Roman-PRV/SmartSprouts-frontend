/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useContainerSize } from "~/libs/hooks/use-container-size/use-container-size.hook";

type ObserverCallback = (entries: { contentRect: { height: number; width: number } }[]) => void;

let lastCallback: null | ObserverCallback = null;
let constructorCallCount = 0;
const observeMock = vi.fn();
const disconnectMock = vi.fn();

class FakeResizeObserver {
	public disconnect = disconnectMock;
	public observe = observeMock;
	public unobserve = vi.fn();

	public constructor(callback: ObserverCallback) {
		lastCallback = callback;
		constructorCallCount += 1;
	}
}

const triggerResize = (width: number, height: number): void => {
	lastCallback?.([{ contentRect: { height, width } }]);
};

const originalResizeObserver = globalThis.ResizeObserver;

beforeEach(() => {
	lastCallback = null;
	constructorCallCount = 0;
	observeMock.mockReset();
	disconnectMock.mockReset();
	(globalThis as { ResizeObserver: typeof ResizeObserver }).ResizeObserver =
		FakeResizeObserver as unknown as typeof ResizeObserver;
});

afterEach(() => {
	(globalThis as { ResizeObserver: typeof ResizeObserver }).ResizeObserver =
		originalResizeObserver;
});

describe("useContainerSize", () => {
	it("starts with zero size", () => {
		const { result } = renderHook(() => useContainerSize<HTMLDivElement>());

		expect(result.current.size).toEqual({ height: 0, width: 0 });
	});

	it("does not observe anything when no node is attached", () => {
		renderHook(() => useContainerSize<HTMLDivElement>());

		expect(constructorCallCount).toBe(0);
	});

	it("observes the element when the callback ref is invoked", () => {
		const { result } = renderHook(() => useContainerSize<HTMLDivElement>());
		const node = document.createElement("div");

		act(() => {
			result.current.containerReference(node);
		});

		expect(constructorCallCount).toBe(1);
		expect(observeMock).toHaveBeenCalledWith(node);
	});

	it("updates size when the observer reports a new content rect", () => {
		const { result } = renderHook(() => useContainerSize<HTMLDivElement>());

		act(() => {
			result.current.containerReference(document.createElement("div"));
		});

		act(() => {
			triggerResize(640, 480);
		});

		expect(result.current.size).toEqual({ height: 480, width: 640 });
	});

	it("disconnects the previous observer when a new node attaches", () => {
		const { result } = renderHook(() => useContainerSize<HTMLDivElement>());

		act(() => {
			result.current.containerReference(document.createElement("div"));
		});

		act(() => {
			result.current.containerReference(document.createElement("div"));
		});

		expect(constructorCallCount).toBe(2);
		expect(disconnectMock).toHaveBeenCalledTimes(1);
	});

	it("disconnects the observer when the node detaches (ref called with null)", () => {
		const { result } = renderHook(() => useContainerSize<HTMLDivElement>());

		act(() => {
			result.current.containerReference(document.createElement("div"));
		});

		act(() => {
			result.current.containerReference(null);
		});

		expect(disconnectMock).toHaveBeenCalledTimes(1);
	});

	it("disconnects the observer on unmount", () => {
		const { result, unmount } = renderHook(() => useContainerSize<HTMLDivElement>());

		act(() => {
			result.current.containerReference(document.createElement("div"));
		});

		unmount();

		expect(disconnectMock).toHaveBeenCalledTimes(1);
	});

	it("connects the observer even when the host element mounts after first render", () => {
		const { result } = renderHook(() => useContainerSize<HTMLDivElement>());

		expect(constructorCallCount).toBe(0);

		act(() => {
			result.current.containerReference(document.createElement("div"));
		});

		expect(constructorCallCount).toBe(1);
	});
});
