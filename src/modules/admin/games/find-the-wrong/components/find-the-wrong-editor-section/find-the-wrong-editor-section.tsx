import { DrawingCanvas } from "~/games/find-the-wrong/find-the-wrong";
import { Button, FallbackMessage, Loader } from "~/libs/components/components";
import { DataStatus } from "~/libs/enums/enums";
import {
	useAppDispatch,
	useCallback,
	useMemo,
	useReducer,
	useState,
	useTranslation,
} from "~/libs/hooks/hooks";
import { type CanvasCoordsApi, type Point, type Polygon } from "~/libs/types/types";
import { type AdminLevelEditorSectionProperties } from "~/modules/admin/libs/types/admin-level-editor-section-properties.type";

import { actions } from "../../api/find-the-wrong-admin";
import { useFindTheWrongAdminLevel, usePolygonAutosave } from "../../hooks/hooks";
import {
	canCloseDrawing,
	drawingReducer,
	initialDrawingState,
} from "../../libs/helpers/drawing-state-machine.helper";
import {
	type CreateFindTheWrongAdminItemPayload,
	type FindTheWrongAdminItemDto,
} from "../../libs/types/types";
import { CreateItemModal } from "../create-item-modal/create-item-modal";
import { EditablePolygonOverlay } from "../editable-polygon-overlay/editable-polygon-overlay";
import { ItemsAdminPanel } from "../items-admin-panel/items-admin-panel";
import sectionStyles from "../section.module.css";
import { DrawingOverlay } from "./drawing-overlay";
import styles from "./styles.module.css";
import { TitleForm } from "./title-form";

const FindTheWrongEditorSection: React.FC<AdminLevelEditorSectionProperties> = ({
	game,
	levelId,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const {
		autosaveItem,
		createItem,
		deleteItem,
		error,
		level,
		loadStatus,
		refetch,
		updateItem,
		updateLevel,
	} = useFindTheWrongAdminLevel({ gameId: game.id, levelId });

	const polygonAutosaveCallback = useCallback(
		(itemId: number, points: Point[]): Promise<void> =>
			autosaveItem(itemId, { polygon: points }),
		[autosaveItem]
	);
	const { schedule: schedulePolygonAutosave } = usePolygonAutosave(polygonAutosaveCallback);

	const [drawingState, drawingDispatch] = useReducer(drawingReducer, initialDrawingState);
	const [capturedPolygon, setCapturedPolygon] = useState<null | Point[]>(null);
	const [activeItemId, setActiveItemId] = useState<null | number>(null);
	const [isSavingLevel, setIsSavingLevel] = useState(false);

	const items = useMemo<FindTheWrongAdminItemDto[]>(() => level?.items ?? [], [level?.items]);
	const polygons = useMemo<Polygon[]>(
		() => items.map((item) => ({ id: item.id, points: item.polygon })),
		[items]
	);

	const handleStartDrawing = useCallback(() => {
		setActiveItemId(null);
		drawingDispatch({ type: "START_DRAWING" });
	}, []);

	const handleCancelDrawing = useCallback(() => {
		drawingDispatch({ type: "CANCEL_DRAWING" });
	}, []);

	const handleAddVertex = useCallback((vertex: Point) => {
		drawingDispatch({ type: "ADD_VERTEX", vertex });
	}, []);

	const handleClosePolygon = useCallback(() => {
		if (drawingState.mode !== "drawing" || !canCloseDrawing(drawingState)) {
			return;
		}

		setCapturedPolygon(drawingState.vertices);
		drawingDispatch({ type: "CLOSE_DRAWING" });
	}, [drawingState]);

	const handleModalClose = useCallback(() => {
		setCapturedPolygon(null);
	}, []);

	const handleCreateItemSubmit = useCallback(
		async (payload: CreateFindTheWrongAdminItemPayload): Promise<void> => {
			await createItem(payload);
		},
		[createItem]
	);

	const handleActiveItemChange = useCallback((itemId: number) => {
		setActiveItemId(itemId);
	}, []);

	const handlePolygonChange = useCallback(
		(itemId: number, points: Point[]) => {
			dispatch(actions.setItemPolygon({ itemId, polygon: points }));
			schedulePolygonAutosave(itemId, points);
		},
		[dispatch, schedulePolygonAutosave]
	);

	const handleSaveLevel = useCallback(
		async (formData: FormData): Promise<void> => {
			setIsSavingLevel(true);

			try {
				await updateLevel(formData);
			} finally {
				setIsSavingLevel(false);
			}
		},
		[updateLevel]
	);

	const editorSlot = useCallback(
		(coords: CanvasCoordsApi): React.ReactElement =>
			drawingState.mode === "drawing" ? (
				<DrawingOverlay
					coords={coords}
					onAddVertex={handleAddVertex}
					vertices={drawingState.vertices}
				/>
			) : (
				<EditablePolygonOverlay
					activeItemId={activeItemId}
					coords={coords}
					items={items}
					onActiveItemChange={handleActiveItemChange}
					onPolygonChange={handlePolygonChange}
				/>
			),
		[
			activeItemId,
			drawingState,
			handleActiveItemChange,
			handleAddVertex,
			handlePolygonChange,
			items,
		]
	);

	if (loadStatus === DataStatus.PENDING || loadStatus === DataStatus.IDLE) {
		return <Loader variant="inline" />;
	}

	if (loadStatus === DataStatus.REJECTED) {
		return (
			<section className={sectionStyles["section"]}>
				<FallbackMessage
					message={error?.message ?? t("admin.findTheWrong.editor.loadError")}
				/>
				<Button onClick={refetch} size="sm" type="button" variant="primary">
					{t("admin.findTheWrong.editor.retry")}
				</Button>
			</section>
		);
	}

	if (!level) {
		return (
			<section className={sectionStyles["section"]}>
				<FallbackMessage message={t("admin.findTheWrong.editor.loadError")} />
			</section>
		);
	}

	return (
		<section className={sectionStyles["section"]}>
			<header className={styles["editor__header"]}>
				<h2 className={sectionStyles["section__title"]}>
					{t("admin.findTheWrong.editor.title")}
				</h2>
			</header>

			<div className={styles["editor__layout"]}>
				<div className={styles["editor__canvas-column"]}>
					<TitleForm isPending={isSavingLevel} level={level} onSubmit={handleSaveLevel} />
					<div className={styles["editor__canvas-toolbar"]}>
						{drawingState.mode === "drawing" ? (
							<>
								<Button
									disabled={!canCloseDrawing(drawingState)}
									onClick={handleClosePolygon}
									size="sm"
									type="button"
									variant="primary"
								>
									{t("admin.findTheWrong.editor.finishPolygon")}
								</Button>
								<Button onClick={handleCancelDrawing} size="sm" type="button" variant="secondary">
									{t("admin.findTheWrong.item.actions.cancelDrawing")}
								</Button>
								<span className={styles["editor__drawing-hint"]}>
									{t("admin.findTheWrong.editor.drawingHint", {
										count: drawingState.vertices.length,
									})}
								</span>
							</>
						) : (
							<Button onClick={handleStartDrawing} size="sm" type="button" variant="primary">
								{t("admin.findTheWrong.editor.addNewItem")}
							</Button>
						)}
					</div>
					<div className={styles["editor__canvas-wrapper"]}>
						{level.image_url ? (
							<DrawingCanvas
								editorSlot={editorSlot}
								imageUrl={level.image_url}
								mode="editor"
								polygons={polygons}
								strokes={[]}
							/>
						) : (
							<p className={styles["editor__canvas-placeholder"]}>
								{t("admin.findTheWrong.editor.noImageHint")}
							</p>
						)}
					</div>
				</div>
				<div className={styles["editor__items-column"]}>
					<ItemsAdminPanel
						activeItemId={activeItemId}
						items={items}
						onActiveItemChange={handleActiveItemChange}
						onDeleteItem={deleteItem}
						onUpdateItem={updateItem}
					/>
				</div>
			</div>

			{capturedPolygon && (
				<CreateItemModal
					isOpen
					onClose={handleModalClose}
					onSubmit={handleCreateItemSubmit}
					polygon={capturedPolygon}
				/>
			)}
		</section>
	);
};

export { FindTheWrongEditorSection };
