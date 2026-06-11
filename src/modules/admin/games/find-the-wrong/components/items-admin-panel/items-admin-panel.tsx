import { FallbackMessage } from "~/libs/components/components";
import { useCallback, useMemo, useState, useTranslation } from "~/libs/hooks/hooks";
import { useLanguageSwitcher } from "~/libs/modules/localization/localization";

import {
	type FindTheWrongAdminItemDto,
	type UpdateFindTheWrongAdminItemPayload,
} from "../../libs/types/types";
import { DeleteItemModal } from "./delete-item-modal";
import { ItemRow } from "./item-row";
import styles from "./styles.module.css";

const EMPTY_ITEMS_COUNT = 0;
const INDEX_OFFSET = 1;

type Properties = {
	activeItemId: null | number;
	items: FindTheWrongAdminItemDto[];
	onActiveItemChange: (itemId: number) => void;
	onDeleteItem: (itemId: number) => Promise<void>;
	onUpdateItem: (itemId: number, payload: UpdateFindTheWrongAdminItemPayload) => Promise<void>;
};

const ItemsAdminPanel: React.FC<Properties> = ({
	activeItemId,
	items,
	onActiveItemChange,
	onDeleteItem,
	onUpdateItem,
}) => {
	const { t } = useTranslation();
	const { currentLanguage } = useLanguageSwitcher();
	const [expandedItemId, setExpandedItemId] = useState<null | number>(null);
	const [pendingDeleteId, setPendingDeleteId] = useState<null | number>(null);

	const handleToggleEdit = useCallback((itemId: number) => {
		setExpandedItemId((current) => (current === itemId ? null : itemId));
	}, []);

	const handleOpenDelete = useCallback((itemId: number) => {
		setPendingDeleteId(itemId);
	}, []);

	const handleCloseDelete = useCallback(() => {
		setPendingDeleteId(null);
	}, []);

	const pendingDeleteItem = useMemo(
		() => items.find((item) => item.id === pendingDeleteId) ?? null,
		[items, pendingDeleteId]
	);

	const handleConfirmDelete = useCallback((): Promise<void> => {
		if (!pendingDeleteItem) {
			return Promise.resolve();
		}

		return onDeleteItem(pendingDeleteItem.id);
	}, [onDeleteItem, pendingDeleteItem]);

	return (
		<aside aria-label={t("admin.findTheWrong.editor.itemsHeading")} className={styles["panel"]}>
			<header className={styles["panel__header"]}>
				<h3 className={styles["panel__title"]}>
					{t("admin.findTheWrong.editor.itemsHeading")}
				</h3>
			</header>
			{items.length === EMPTY_ITEMS_COUNT ? (
				<FallbackMessage message={t("admin.findTheWrong.editor.emptyItems")} />
			) : (
				<ul className={styles["panel__list"]}>
					{items.map((item, index) => (
						<ItemRow
							displayName={item.name[currentLanguage] || item.name.en}
							displayNumber={index + INDEX_OFFSET}
							isActive={item.id === activeItemId}
							isExpanded={expandedItemId === item.id}
							item={item}
							key={item.id}
							onOpenDelete={handleOpenDelete}
							onSelect={onActiveItemChange}
							onToggleEdit={handleToggleEdit}
							onUpdate={onUpdateItem}
						/>
					))}
				</ul>
			)}
			{pendingDeleteItem && (
				<DeleteItemModal
					isOpen
					itemName={pendingDeleteItem.name[currentLanguage] || pendingDeleteItem.name.en}
					onClose={handleCloseDelete}
					onConfirm={handleConfirmDelete}
				/>
			)}
		</aside>
	);
};

export { ItemsAdminPanel };
