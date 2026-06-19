/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useMarkers } from "~/games/find-the-wrong/libs/hooks/use-markers/use-markers.hook";

describe("useMarkers", () => {
	it("starts with no markers", () => {
		const { result } = renderHook(() => useMarkers());

		expect(result.current.markers).toEqual([]);
	});

	it("adds a marker on the first tap, stamped with a placed time", () => {
		const { result } = renderHook(() => useMarkers());

		act(() => {
			result.current.toggleMarker([0.2, 0.3]);
		});

		expect(result.current.markers).toHaveLength(1);
		expect(result.current.markers[0]?.point).toEqual([0.2, 0.3]);
		expect(typeof result.current.markers[0]?.placedAtMs).toBe("number");
	});

	it("keeps distinct far-apart taps as separate markers", () => {
		const { result } = renderHook(() => useMarkers());

		act(() => {
			result.current.toggleMarker([0.1, 0.1]);
		});
		act(() => {
			result.current.toggleMarker([0.9, 0.9]);
		});

		expect(result.current.markers).toHaveLength(2);
	});

	it("removes a marker when tapped again within the hit radius", () => {
		const { result } = renderHook(() => useMarkers());

		act(() => {
			result.current.toggleMarker([0.5, 0.5]);
		});
		act(() => {
			result.current.toggleMarker([0.51, 0.51]);
		});

		expect(result.current.markers).toHaveLength(0);
	});

	it("stops adding once the limit is reached but still allows removal", () => {
		const { result } = renderHook(() => useMarkers(2));

		act(() => {
			result.current.toggleMarker([0.1, 0.1]);
		});
		act(() => {
			result.current.toggleMarker([0.5, 0.5]);
		});
		act(() => {
			result.current.toggleMarker([0.9, 0.9]);
		});

		expect(result.current.markers).toHaveLength(2);

		act(() => {
			result.current.toggleMarker([0.1, 0.1]);
		});

		expect(result.current.markers).toHaveLength(1);
	});

	it("clears all markers", () => {
		const { result } = renderHook(() => useMarkers());

		act(() => {
			result.current.toggleMarker([0.1, 0.1]);
		});
		act(() => {
			result.current.toggleMarker([0.9, 0.9]);
		});
		act(() => {
			result.current.clearAll();
		});

		expect(result.current.markers).toEqual([]);
	});
});
