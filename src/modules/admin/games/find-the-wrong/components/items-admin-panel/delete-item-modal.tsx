import { Button, Modal } from "~/libs/components/components";
import { useCallback, useState, useTranslation } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";

type Properties = {
	isOpen: boolean;
	itemName: string;
	onClose: () => void;
	onConfirm: () => Promise<void>;
};

const DeleteItemModal: React.FC<Properties> = ({ isOpen, itemName, onClose, onConfirm }) => {
	const { t } = useTranslation();
	const [isPending, setIsPending] = useState(false);

	const handleConfirm = useCallback(async () => {
		setIsPending(true);

		try {
			await onConfirm();
			onClose();
		} catch {
			// Hook already surfaced the error via toast; modal stays open for retry.
		} finally {
			setIsPending(false);
		}
	}, [onClose, onConfirm]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={t("admin.findTheWrong.item.delete.confirmTitle")}
		>
			<p className={styles["delete-modal__body"]}>
				{t("admin.findTheWrong.item.delete.confirmBody", { name: itemName })}
			</p>
			<div className={styles["delete-modal__actions"]}>
				<Button disabled={isPending} onClick={onClose} size="sm" type="button" variant="secondary">
					{t("admin.findTheWrong.item.delete.cancel")}
				</Button>
				<Button
					isLoading={isPending}
					onClick={handleConfirm}
					size="sm"
					type="button"
					variant="danger"
				>
					{t("admin.findTheWrong.item.delete.confirmCta")}
				</Button>
			</div>
		</Modal>
	);
};

export { DeleteItemModal };
