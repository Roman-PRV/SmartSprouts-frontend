import { type AsyncThunkAction } from "@reduxjs/toolkit";
import { useCallback, useEffect, useRef } from "react";

import { DataStatus } from "~/libs/enums/enums";
import { useAppDispatch } from "~/libs/hooks/use-app-dispatch/use-app-dispatch.hook";
import { useAppSelector } from "~/libs/hooks/use-app-selector/use-app-selector.hook";
import { useLanguageSync } from "~/libs/hooks/use-language-sync/use-language-sync.hook";
import { type AsyncThunkConfig, type ValueOf } from "~/libs/types/types";

type FetchByIdConfig<TData> = {
	/** Must be a stable reference (module-level thunk creator), else the effect loops. */
	createFetch: (id: string) => AsyncThunkAction<TData, string, AsyncThunkConfig>;
	id: string | undefined;
	/**
	 * Refetch once on mount even when the id is already cached, keeping the cached
	 * data visible meanwhile (stale-while-revalidate). For resources that carry
	 * mutable per-user state (e.g. level progress) so revisiting the list reflects
	 * changes made elsewhere without a loading flash.
	 */
	revalidateOnMount?: boolean;
	selectData: (state: RootState) => null | TData;
	selectLoadedId: (state: RootState) => null | string;
	selectStatus: (state: RootState) => ValueOf<typeof DataStatus>;
};

type FetchByIdReturn<TData> = {
	data: null | TData;
	hasError: boolean;
	isLoading: boolean;
};

type RootState = AsyncThunkConfig["state"];

/**
 * URL-driven fetch-by-id. The URL `id` is the source of truth: data is loaded
 * whenever the cached resource belongs to a different id, the previous in-flight
 * request is aborted, and `data` is exposed only when it matches the current id
 * (never stale). Used by `useGameFetch`/`useLevelsFetch`.
 */
const useFetchById = <TData>({
	createFetch,
	id,
	revalidateOnMount = false,
	selectData,
	selectLoadedId,
	selectStatus,
}: FetchByIdConfig<TData>): FetchByIdReturn<TData> => {
	const dispatch = useAppDispatch();
	const status = useAppSelector(selectStatus);
	const loadedId = useAppSelector(selectLoadedId);
	const data = useAppSelector(selectData);

	const abortReference = useRef<(() => void) | null>(null);
	const attemptedIdReference = useRef<string | undefined>(undefined);

	// Captured at first render: revalidate on mount only when the id was already
	// cached (a true revisit). A fresh id is handled by the load effect below, so
	// this never double-fetches the first visit. Held as a constant ref (not
	// consumed) so it survives StrictMode's mount→unmount→mount: the unmount
	// cleanup aborts the first dispatch, and the second mount re-issues it.
	const wasCachedAtMountReference = useRef(
		revalidateOnMount && id !== undefined && loadedId === id
	);
	const mountIdReference = useRef(id);

	const fetchById = useCallback(() => {
		if (!id) {
			return;
		}

		attemptedIdReference.current = id;
		abortReference.current?.();

		const promise = dispatch(createFetch(id));

		abortReference.current = (): void => {
			promise.abort();
			abortReference.current = null;
		};
	}, [dispatch, createFetch, id]);

	useLanguageSync(fetchById);

	useEffect(() => {
		if (!id || loadedId === id) {
			return;
		}

		fetchById();
	}, [id, loadedId, fetchById]);

	useEffect(() => {
		// Only the id cached at mount is revalidated. Without the id guard, a later
		// id change (same mounted component, new route param) would re-run this via
		// the changed `fetchById` and fire a second, redundant fetch on top of the
		// load effect's.
		if (!wasCachedAtMountReference.current || id !== mountIdReference.current) {
			return;
		}

		fetchById();
	}, [fetchById, id]);

	useEffect(() => {
		return (): void => {
			abortReference.current?.();
		};
	}, []);

	// Error/loading are gated to the CURRENT id: a REJECTED status left over from
	// a previous id must not flash as an error on the next one before its fetch
	// starts.
	const isMatched = id !== undefined && loadedId === id;
	const isErrorForCurrentId =
		id !== undefined && status === DataStatus.REJECTED && attemptedIdReference.current === id;
	const isLoading = id !== undefined && !isMatched && !isErrorForCurrentId;

	return {
		// A failed background revalidate (matched id) must not blank the page: keep
		// the cached data and suppress the error while we still have a match.
		data: isMatched ? data : null,
		hasError: isErrorForCurrentId && !isMatched,
		isLoading,
	};
};

export { useFetchById };
