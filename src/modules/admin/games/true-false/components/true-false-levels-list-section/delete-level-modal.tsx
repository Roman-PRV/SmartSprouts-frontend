import { toast } from "sonner";

import { Button, Modal } from "~/libs/components/components";
import { useAppDispatch, useCallback, useState, useTranslation } from "~/libs/hooks/hooks";

import { deleteLevel } from "../../api/true-false-admin";
import styles from "./styles.module.css";

type Properties = {
	gameId: string;
	levelId: number;
	levelTitle: string;
	onClose: () => void;
};

const DeleteLevelModal: React.FC<Properties> = ({ gameId, levelId, levelTitle, onClose }) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [isPending, setIsPending] = useState(false);

	const handleConfirm = useCallback(async () => {
		setIsPending(true);

		try {
			await dispatch(deleteLevel({ gameId, levelId })).unwrap();

			toast.success(t("admin.trueFalse.level.delete.success"));
			onClose();
		} catch {
			toast.error(t("admin.trueFalse.level.delete.error"));
		} finally {
			setIsPending(false);
		}
	}, [dispatch, gameId, levelId, onClose, t]);

	return (
		<Modal isOpen onClose={onClose} title={t("admin.trueFalse.level.delete.confirmTitle")}>
			<p className={styles["levels-list__delete-body"]}>
				{t("admin.trueFalse.level.delete.confirmBody", { title: levelTitle })}
			</p>
			<div className={styles["levels-list__delete-actions"]}>
				<Button disabled={isPending} onClick={onClose} type="button" variant="secondary">
					{t("admin.trueFalse.level.delete.cancel")}
				</Button>
				<Button isLoading={isPending} onClick={handleConfirm} type="button" variant="danger">
					{t("admin.trueFalse.level.delete.confirmCta")}
				</Button>
			</div>
		</Modal>
	);
};

export { DeleteLevelModal };
