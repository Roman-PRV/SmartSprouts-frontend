import { toast } from "sonner";

import { Button, Modal } from "~/libs/components/components";
import { toastError } from "~/libs/helpers/helpers";
import { useAppDispatch, useCallback, useState, useTranslation } from "~/libs/hooks/hooks";

import { deleteStatement } from "../../api/true-false-admin";
import styles from "./styles.module.css";

type Properties = {
	gameId: string;
	onClose: () => void;
	statementId: number;
	statementText: string;
};

const DeleteStatementModal: React.FC<Properties> = ({
	gameId,
	onClose,
	statementId,
	statementText,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [isPending, setIsPending] = useState(false);

	const handleConfirm = useCallback(async () => {
		setIsPending(true);

		try {
			await dispatch(deleteStatement({ gameId, statementId })).unwrap();

			toast.success(t("admin.trueFalse.statement.delete.success"));
			onClose();
		} catch (error) {
			toastError(error, t("admin.trueFalse.statement.delete.error"));
		} finally {
			setIsPending(false);
		}
	}, [dispatch, gameId, onClose, statementId, t]);

	return (
		<Modal isOpen onClose={onClose} title={t("admin.trueFalse.statement.delete.confirmTitle")}>
			<p className={styles["delete-statement__body"]}>
				{t("admin.trueFalse.statement.delete.confirmBody", { text: statementText })}
			</p>
			<div className={styles["delete-statement__actions"]}>
				<Button disabled={isPending} onClick={onClose} type="button" variant="secondary">
					{t("admin.trueFalse.statement.delete.cancel")}
				</Button>
				<Button isLoading={isPending} onClick={handleConfirm} type="button" variant="danger">
					{t("admin.trueFalse.statement.delete.confirmCta")}
				</Button>
			</div>
		</Modal>
	);
};

export { DeleteStatementModal };
