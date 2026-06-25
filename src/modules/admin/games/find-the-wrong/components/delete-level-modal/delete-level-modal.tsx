import { toast } from "sonner";

import { Button, Modal } from "~/libs/components/components";
import { useAppDispatch, useCallback, useState, useTranslation } from "~/libs/hooks/hooks";

import { deleteLevel } from "../../api/find-the-wrong-admin";
import styles from "./styles.module.css";

type Properties = {
	gameId: string;
	isOpen: boolean;
	levelId: number;
	levelTitle: string;
	onClose: () => void;
};

const DeleteLevelModal: React.FC<Properties> = ({
	gameId,
	isOpen,
	levelId,
	levelTitle,
	onClose,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [isPending, setIsPending] = useState(false);

	const handleConfirm = useCallback(async () => {
		setIsPending(true);

		try {
			await dispatch(deleteLevel({ gameId, levelId })).unwrap();

			toast.success(t("admin.findTheWrong.delete.success"));
			onClose();
		} catch {
			toast.error(t("admin.findTheWrong.delete.error"));
		} finally {
			setIsPending(false);
		}
	}, [dispatch, gameId, levelId, onClose, t]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={t("admin.findTheWrong.delete.confirmTitle")}>
			<p className={styles["body"]}>
				{t("admin.findTheWrong.delete.confirmBody", { title: levelTitle })}
			</p>
			<div className={styles["actions"]}>
				<Button disabled={isPending} onClick={onClose} type="button" variant="secondary">
					{t("admin.findTheWrong.delete.cancel")}
				</Button>
				<Button isLoading={isPending} onClick={handleConfirm} type="button" variant="danger">
					{t("admin.findTheWrong.delete.confirmCta")}
				</Button>
			</div>
		</Modal>
	);
};

export { DeleteLevelModal };
