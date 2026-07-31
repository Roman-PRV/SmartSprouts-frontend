import { toast } from "sonner";

import { type DataStatus } from "~/libs/enums/enums";
import { toastError } from "~/libs/helpers/helpers";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useTranslation,
} from "~/libs/hooks/hooks";
import { type ThunkErrorPayload, type ValueOf } from "~/libs/types/types";

import {
	actions,
	createItem,
	deleteItem,
	getLevel,
	updateItem,
	updateLevel,
} from "../../api/find-the-wrong-admin";
import {
	type CreateFindTheWrongAdminItemPayload,
	type FindTheWrongAdminLevelDto,
	type UpdateFindTheWrongAdminItemPayload,
} from "../../libs/types/types";

type UseFindTheWrongAdminLevelArguments = {
	gameId: string;
	levelId: number;
};

type UseFindTheWrongAdminLevelReturn = {
	autosaveItem: (itemId: number, payload: UpdateFindTheWrongAdminItemPayload) => Promise<void>;
	createItem: (payload: CreateFindTheWrongAdminItemPayload) => Promise<void>;
	deleteItem: (itemId: number) => Promise<void>;
	error: null | ThunkErrorPayload;
	level: FindTheWrongAdminLevelDto | null;
	loadStatus: ValueOf<typeof DataStatus>;
	refetch: () => void;
	updateItem: (itemId: number, payload: UpdateFindTheWrongAdminItemPayload) => Promise<void>;
	updateLevel: (formData: FormData) => Promise<void>;
};

const useFindTheWrongAdminLevel = ({
	gameId,
	levelId,
}: UseFindTheWrongAdminLevelArguments): UseFindTheWrongAdminLevelReturn => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { currentLevel, levelError, loadStatus } = useAppSelector(
		(state) => state.findTheWrongAdmin
	);

	useEffect(() => {
		const promise = dispatch(getLevel({ gameId, levelId }));

		return (): void => {
			promise.abort();
			dispatch(actions.clearCurrentLevel());
		};
	}, [dispatch, gameId, levelId]);

	const refetch = useCallback(() => {
		void dispatch(getLevel({ gameId, levelId }));
	}, [dispatch, gameId, levelId]);

	const handleUpdateLevel = useCallback(
		async (formData: FormData): Promise<void> => {
			try {
				await dispatch(updateLevel({ formData, gameId, levelId })).unwrap();
				toast.success(t("admin.findTheWrong.editor.updateSuccess"));
			} catch (error) {
				toastError(error, t("admin.findTheWrong.editor.updateError"));

				throw error;
			}
		},
		[dispatch, gameId, levelId, t]
	);

	const handleCreateItem = useCallback(
		async (payload: CreateFindTheWrongAdminItemPayload): Promise<void> => {
			try {
				await dispatch(createItem({ gameId, levelId, payload })).unwrap();
				toast.success(t("admin.findTheWrong.item.create.success"));
			} catch (error) {
				toastError(error, t("admin.findTheWrong.item.create.error"));

				throw error;
			}
		},
		[dispatch, gameId, levelId, t]
	);

	const handleUpdateItem = useCallback(
		async (itemId: number, payload: UpdateFindTheWrongAdminItemPayload): Promise<void> => {
			try {
				await dispatch(updateItem({ gameId, itemId, payload })).unwrap();
				toast.success(t("admin.findTheWrong.item.update.success"));
			} catch (error) {
				toastError(error, t("admin.findTheWrong.item.update.error"));

				throw error;
			}
		},
		[dispatch, gameId, t]
	);

	const handleAutosaveItem = useCallback(
		async (itemId: number, payload: UpdateFindTheWrongAdminItemPayload): Promise<void> => {
			try {
				await dispatch(updateItem({ gameId, itemId, payload })).unwrap();
			} catch (error) {
				toastError(error, t("admin.findTheWrong.item.update.error"));
			}
		},
		[dispatch, gameId, t]
	);

	const handleDeleteItem = useCallback(
		async (itemId: number): Promise<void> => {
			try {
				await dispatch(deleteItem({ gameId, itemId })).unwrap();
				toast.success(t("admin.findTheWrong.item.delete.success"));
			} catch (error) {
				toastError(error, t("admin.findTheWrong.item.delete.error"));

				throw error;
			}
		},
		[dispatch, gameId, t]
	);

	return {
		autosaveItem: handleAutosaveItem,
		createItem: handleCreateItem,
		deleteItem: handleDeleteItem,
		error: levelError,
		level: currentLevel,
		loadStatus,
		refetch,
		updateItem: handleUpdateItem,
		updateLevel: handleUpdateLevel,
	};
};

export { useFindTheWrongAdminLevel };
