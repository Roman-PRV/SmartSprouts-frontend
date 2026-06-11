import { Button } from "~/libs/components/components";
import { useCallback, useTranslation } from "~/libs/hooks/hooks";

import {
	type FindTheWrongAdminItemDto,
	type UpdateFindTheWrongAdminItemPayload,
} from "../../libs/types/types";
import { ItemEditForm } from "./item-edit-form";
import styles from "./styles.module.css";

type Properties = {
	displayName: string;
	displayNumber: number;
	isActive: boolean;
	isExpanded: boolean;
	item: FindTheWrongAdminItemDto;
	onOpenDelete: (itemId: number) => void;
	onSelect: (itemId: number) => void;
	onToggleEdit: (itemId: number) => void;
	onUpdate: (itemId: number, payload: UpdateFindTheWrongAdminItemPayload) => Promise<void>;
};

const ItemRow: React.FC<Properties> = ({
	displayName,
	displayNumber,
	isActive,
	isExpanded,
	item,
	onOpenDelete,
	onSelect,
	onToggleEdit,
	onUpdate,
}) => {
	const { t } = useTranslation();

	const handleSelect = useCallback(() => {
		onSelect(item.id);
	}, [item.id, onSelect]);

	const handleToggleEdit = useCallback(() => {
		onToggleEdit(item.id);
	}, [item.id, onToggleEdit]);

	const handleOpenDelete = useCallback(() => {
		onOpenDelete(item.id);
	}, [item.id, onOpenDelete]);

	const handleUpdateSubmit = useCallback(
		(payload: UpdateFindTheWrongAdminItemPayload): Promise<void> => onUpdate(item.id, payload),
		[item.id, onUpdate]
	);

	return (
		<li className={styles["panel__item"]} data-active={isActive}>
			<button
				className={styles["panel__item-summary"]}
				onClick={handleSelect}
				type="button"
			>
				<span className={styles["panel__item-index"]}>{displayNumber}</span>
				<span className={styles["panel__item-name"]}>{displayName}</span>
			</button>
			<div className={styles["panel__item-actions"]}>
				<Button onClick={handleToggleEdit} size="sm" type="button" variant="secondary">
					{t("admin.findTheWrong.item.actions.edit")}
				</Button>
				<Button onClick={handleOpenDelete} size="sm" type="button" variant="danger">
					{t("admin.findTheWrong.item.actions.delete")}
				</Button>
			</div>
			{isExpanded && <ItemEditForm item={item} onSubmit={handleUpdateSubmit} />}
		</li>
	);
};

export { ItemRow };
