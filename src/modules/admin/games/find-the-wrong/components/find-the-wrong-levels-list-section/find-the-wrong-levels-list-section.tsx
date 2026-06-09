import { Button, FallbackMessage, Loader } from "~/libs/components/components";
import { DataStatus } from "~/libs/enums/enums";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useMemo,
	useState,
	useTranslation,
} from "~/libs/hooks/hooks";
import { useLanguageSwitcher } from "~/libs/modules/localization/localization";
import { type AdminLevelsListSectionProperties } from "~/modules/admin/libs/types/admin-levels-list-section-properties.type";

import { actions, getLevelsList } from "../../api/find-the-wrong-admin";
import { type FindTheWrongAdminLevelDto } from "../../libs/types/types";
import { CreateLevelModal } from "../create-level-modal/create-level-modal";
import { DeleteLevelModal } from "../delete-level-modal/delete-level-modal";
import sectionStyles from "../section.module.css";
import { LevelRow } from "./level-row";
import styles from "./styles.module.css";

const PAGE_SIZE = 20;
const FIRST_PAGE = 1;
const PAGE_STEP = 1;
const ZERO_COUNT = 0;

type PendingDelete = {
	levelId: number;
	levelTitle: string;
};

const FindTheWrongLevelsListSection: React.FC<AdminLevelsListSectionProperties> = ({ game }) => {
	const { t } = useTranslation();
	const { currentLanguage } = useLanguageSwitcher();
	const dispatch = useAppDispatch();

	const { levelsList, listStatus } = useAppSelector((state) => state.findTheWrongAdmin);

	const [page, setPage] = useState(FIRST_PAGE);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [pendingDelete, setPendingDelete] = useState<null | PendingDelete>(null);

	useEffect(() => {
		const promise = dispatch(getLevelsList(game.id));

		return (): void => {
			promise.abort();
			dispatch(actions.clearLevelsList());
		};
	}, [dispatch, game.id]);

	const totalPages = Math.max(FIRST_PAGE, Math.ceil(levelsList.length / PAGE_SIZE));

	useEffect(() => {
		if (page > totalPages) {
			setPage(totalPages);
		}
	}, [page, totalPages]);

	const visibleLevels = useMemo(() => {
		const start = (page - FIRST_PAGE) * PAGE_SIZE;

		return levelsList.slice(start, start + PAGE_SIZE);
	}, [levelsList, page]);

	const handleOpenCreate = useCallback(() => {
		setIsCreateOpen(true);
	}, []);

	const handleCloseCreate = useCallback(() => {
		setIsCreateOpen(false);
	}, []);

	const handleOpenDelete = useCallback(
		(level: FindTheWrongAdminLevelDto) => {
			setPendingDelete({
				levelId: level.id,
				levelTitle: level.title[currentLanguage],
			});
		},
		[currentLanguage]
	);

	const handleCloseDelete = useCallback(() => {
		setPendingDelete(null);
	}, []);

	const handlePreviousPage = useCallback(() => {
		setPage((current) => Math.max(FIRST_PAGE, current - PAGE_STEP));
	}, []);

	const handleNextPage = useCallback(() => {
		setPage((current) => Math.min(totalPages, current + PAGE_STEP));
	}, [totalPages]);

	const handleRetry = useCallback(() => {
		void dispatch(getLevelsList(game.id));
	}, [dispatch, game.id]);

	const isLoading = listStatus === DataStatus.PENDING || listStatus === DataStatus.IDLE;
	const isEmpty = listStatus === DataStatus.FULFILLED && levelsList.length === ZERO_COUNT;
	const isRejected = listStatus === DataStatus.REJECTED;
	const showPagination = levelsList.length > PAGE_SIZE;

	return (
		<section className={sectionStyles["section"]}>
			<h2 className={sectionStyles["section__title"]}>{t("admin.findTheWrong.list.title")}</h2>

			<div className={styles["levels-list__toolbar"]}>
				<Button onClick={handleOpenCreate} type="button" variant="primary">
					{t("admin.findTheWrong.list.create")}
				</Button>
			</div>

			{isLoading && <Loader variant="inline" />}

			{isEmpty && <FallbackMessage message={t("admin.findTheWrong.emptyList")} />}

			{isRejected && (
				<div className={styles["levels-list__error"]}>
					<FallbackMessage message={t("admin.findTheWrong.list.loadError")} />
					<Button onClick={handleRetry} type="button" variant="primary">
						{t("admin.findTheWrong.list.retry")}
					</Button>
				</div>
			)}

			{!isLoading && !isEmpty && !isRejected && (
				<>
					<div className={styles["levels-list__table-wrapper"]}>
						<table className={styles["levels-list__table"]}>
							<thead>
								<tr>
									<th>{t("admin.findTheWrong.list.columns.id")}</th>
									<th>{t("admin.findTheWrong.list.columns.title")}</th>
									<th>{t("admin.findTheWrong.list.columns.image")}</th>
									<th>{t("admin.findTheWrong.list.columns.itemsCount")}</th>
									<th>{t("admin.findTheWrong.list.columns.actions")}</th>
								</tr>
							</thead>
							<tbody>
								{visibleLevels.map((level) => (
									<LevelRow
										gameId={game.id}
										key={level.id}
										level={level}
										localizedTitle={level.title[currentLanguage]}
										onDelete={handleOpenDelete}
									/>
								))}
							</tbody>
						</table>
					</div>

					{showPagination && (
						<div className={styles["levels-list__pagination"]}>
							<Button
								disabled={page === FIRST_PAGE}
								onClick={handlePreviousPage}
								type="button"
								variant="secondary"
							>
								{t("admin.findTheWrong.pagination.previous")}
							</Button>
							<span className={styles["levels-list__pagination-status"]}>
								{t("admin.findTheWrong.pagination.status", { page, total: totalPages })}
							</span>
							<Button
								disabled={page === totalPages}
								onClick={handleNextPage}
								type="button"
								variant="secondary"
							>
								{t("admin.findTheWrong.pagination.next")}
							</Button>
						</div>
					)}
				</>
			)}

			<CreateLevelModal game={game} isOpen={isCreateOpen} onClose={handleCloseCreate} />

			{pendingDelete && (
				<DeleteLevelModal
					gameId={game.id}
					isOpen
					levelId={pendingDelete.levelId}
					levelTitle={pendingDelete.levelTitle}
					onClose={handleCloseDelete}
				/>
			)}
		</section>
	);
};

export { FindTheWrongLevelsListSection };
