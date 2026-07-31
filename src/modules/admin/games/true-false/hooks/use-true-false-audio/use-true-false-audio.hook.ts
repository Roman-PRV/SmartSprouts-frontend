import { toast } from "sonner";

import { toastError } from "~/libs/helpers/helpers";
import { useAppDispatch, useCallback, useEffect, useRef, useTranslation } from "~/libs/hooks/hooks";
import { type Language } from "~/libs/modules/localization/localization";

import {
	getLevel,
	regenerateLevelAudio,
	regenerateStatementAudio,
} from "../../api/true-false-admin";
import { AudioField } from "../../libs/enums/enums";
import { buildAudioKey } from "../../libs/helpers/build-audio-key.helper";
import {
	type AudioStatusMap,
	type TrueFalseAdminLevelDto,
	type TrueFalseAdminStatementDto,
} from "../../libs/types/types";
import { useAudioRegen } from "../use-audio-regen/use-audio-regen.hook";

const LEVEL_SCOPE = "level";
const STATEMENT_SCOPE_PREFIX = "statement:";

type TrackablePromise<T> = {
	abort: () => void;
	unwrap: () => Promise<T>;
};

type UseTrueFalseAudioReturn = {
	isGenerating: (scope: string, field: string, locale: Language) => boolean;
	levelScope: string;
	regenerate: (scope: string, field: string, locale: Language) => void;
	statementScope: (statementId: number) => string;
};

const levelAudioMap = (
	level: null | TrueFalseAdminLevelDto,
	field: string
): AudioStatusMap | undefined => {
	const byField: Record<string, AudioStatusMap | undefined> = {
		[AudioField.TEXT]: level?.text_audio,
		[AudioField.TITLE]: level?.title_audio,
	};

	return byField[field];
};

const statementAudioMap = (
	statement: TrueFalseAdminStatementDto | undefined,
	field: string
): AudioStatusMap | undefined => {
	const byField: Record<string, AudioStatusMap | undefined> = {
		[AudioField.EXPLANATION]: statement?.explanation_audio,
		[AudioField.STATEMENT]: statement?.statement_audio,
	};

	return byField[field];
};

/**
 * Bridges the generic regen hook to the true/false store and thunks: fires the
 * right regenerate request, re-fetches the level to refresh audio status, and
 * reports whether a specific (scope, field, locale) is still generating.
 */
const useTrueFalseAudio = (gameId: string, levelId: number): UseTrueFalseAudioReturn => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { isGenerating: isKeyGenerating, regenerate: runRegenerate } = useAudioRegen();

	const pendingReference = useRef<Set<TrackablePromise<unknown>>>(new Set());

	useEffect(() => {
		const pending = pendingReference.current;

		return (): void => {
			for (const action of pending) {
				action.abort();
			}

			pending.clear();
		};
	}, []);

	const tracked = useCallback(async <T>(action: TrackablePromise<T>): Promise<T> => {
		pendingReference.current.add(action);

		try {
			return await action.unwrap();
		} finally {
			pendingReference.current.delete(action);
		}
	}, []);

	const refresh = useCallback(
		async (): Promise<TrueFalseAdminLevelDto> =>
			await tracked(dispatch(getLevel({ gameId, levelId }))),
		[dispatch, gameId, levelId, tracked]
	);

	const statementScope = useCallback(
		(statementId: number): string => `${STATEMENT_SCOPE_PREFIX}${String(statementId)}`,
		[]
	);

	const isGenerating = useCallback(
		(scope: string, field: string, locale: Language): boolean =>
			isKeyGenerating(buildAudioKey(scope, field, locale)),
		[isKeyGenerating]
	);

	const regenerate = useCallback(
		(scope: string, field: string, locale: Language): void => {
			const isStatement = scope.startsWith(STATEMENT_SCOPE_PREFIX);
			const statementId = isStatement ? Number(scope.slice(STATEMENT_SCOPE_PREFIX.length)) : null;

			const run = async (): Promise<void> => {
				if (statementId === null) {
					await tracked(
						dispatch(regenerateLevelAudio({ gameId, levelId, payload: { field, locale } }))
					);

					return;
				}

				await tracked(
					dispatch(regenerateStatementAudio({ gameId, payload: { field, locale }, statementId }))
				);
			};

			const isStillStale = (level: TrueFalseAdminLevelDto): boolean => {
				if (statementId === null) {
					return Boolean(levelAudioMap(level, field)?.[locale]?.is_stale);
				}

				const statement = level.statements?.find((item) => item.id === statementId);

				return Boolean(statementAudioMap(statement, field)?.[locale]?.is_stale);
			};

			void runRegenerate({
				isStillStale,
				key: buildAudioKey(scope, field, locale),
				refresh,
				run,
			})
				.then((outcome) => {
					if (outcome === "timeout") {
						toast.warning(t("admin.trueFalse.audio.timeout"));
					}
				})
				.catch((error: unknown) => {
					toastError(error, t("admin.trueFalse.audio.error"));
				});
		},
		[dispatch, gameId, levelId, refresh, runRegenerate, t, tracked]
	);

	return {
		isGenerating,
		levelScope: LEVEL_SCOPE,
		regenerate,
		statementScope,
	};
};

export { useTrueFalseAudio };
