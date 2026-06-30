import { Button, FallbackMessage, Loader } from "~/libs/components/components";
import { DataStatus } from "~/libs/enums/enums";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useState,
	useTranslation,
} from "~/libs/hooks/hooks";
import { useLanguageSwitcher } from "~/libs/modules/localization/localization";
import { type AdminLevelsListSectionProperties } from "~/modules/admin/libs/types/admin-levels-list-section-properties.type";

import { actions, getLevelsList } from "../../api/true-false-admin";
import { type TrueFalseAdminLevelDto } from "../../libs/types/types";
import { CreateLevelModal } from "../level-forms/create-level-modal";
import sectionStyles from "../section.module.css";
import { DeleteLevelModal } from "./delete-level-modal";
import { LevelRow } from "./level-row";
import styles from "./styles.module.css";

const EMPTY_COUNT = 0;

type PendingDelete = { levelId: number; levelTitle: string };

const TrueFalseLevelsListSection: React.FC<AdminLevelsListSectionProperties> = ({ game }) => {
	const { t } = useTranslation();
	const { currentLanguage } = useLanguageSwitcher();
	const dispatch = useAppDispatch();

	const { levelsList, listStatus } = useAppSelector((state) => state.trueFalseAdmin);

	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [pendingDelete, setPendingDelete] = useState<null | PendingDelete>(null);

	useEffect(() => {
		const promise = dispatch(getLevelsList(game.id));

		return (): void => {
			promise.abort();
			dispatch(actions.clearLevelsList());
		};
	}, [dispatch, game.id]);

	const handleOpenCreate = useCallback(() => {
		setIsCreateOpen(true);
	}, []);
	const handleCloseCreate = useCallback(() => {
		setIsCreateOpen(false);
	}, []);
	const handleCloseDelete = useCallback(() => {
		setPendingDelete(null);
	}, []);
	const handleRetry = useCallback(() => {
		void dispatch(getLevelsList(game.id));
	}, [dispatch, game.id]);

	const handleDelete = useCallback(
		(level: TrueFalseAdminLevelDto) => {
			setPendingDelete({ levelId: level.id, levelTitle: level.title[currentLanguage] });
		},
		[currentLanguage]
	);

	const isLoading = listStatus === DataStatus.IDLE || listStatus === DataStatus.PENDING;
	const isEmpty = listStatus === DataStatus.FULFILLED && levelsList.length === EMPTY_COUNT;
	const isRejected = listStatus === DataStatus.REJECTED;

	return (
		<section className={sectionStyles["section"]}>
			<h2 className={sectionStyles["section__title"]}>{t("admin.trueFalse.list.title")}</h2>

			<div className={styles["levels-list__toolbar"]}>
				<Button onClick={handleOpenCreate} type="button" variant="primary">
					{t("admin.trueFalse.list.create")}
				</Button>
			</div>

			{isLoading && <Loader variant="inline" />}
			{isEmpty && <FallbackMessage message={t("admin.trueFalse.list.empty")} />}

			{isRejected && (
				<div className={styles["levels-list__error"]}>
					<FallbackMessage message={t("admin.trueFalse.list.loadError")} />
					<Button onClick={handleRetry} type="button" variant="primary">
						{t("admin.trueFalse.list.retry")}
					</Button>
				</div>
			)}

			{!isLoading && !isEmpty && !isRejected && (
				<div className={styles["levels-list__table-wrapper"]}>
					<table className={styles["levels-list__table"]}>
						<thead>
							<tr>
								<th>{t("admin.trueFalse.list.columns.id")}</th>
								<th>{t("admin.trueFalse.list.columns.title")}</th>
								<th>{t("admin.trueFalse.list.columns.image")}</th>
								<th>{t("admin.trueFalse.list.columns.statementsCount")}</th>
								<th>{t("admin.trueFalse.list.columns.actions")}</th>
							</tr>
						</thead>
						<tbody>
							{levelsList.map((level) => (
								<LevelRow
									gameId={game.id}
									key={level.id}
									level={level}
									localizedTitle={level.title[currentLanguage]}
									onDelete={handleDelete}
								/>
							))}
						</tbody>
					</table>
				</div>
			)}

			<CreateLevelModal game={game} isOpen={isCreateOpen} onClose={handleCloseCreate} />

			{pendingDelete && (
				<DeleteLevelModal
					gameId={game.id}
					levelId={pendingDelete.levelId}
					levelTitle={pendingDelete.levelTitle}
					onClose={handleCloseDelete}
				/>
			)}
		</section>
	);
};

export { TrueFalseLevelsListSection };
