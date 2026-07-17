import { toast } from "sonner";

import { Button, Modal } from "~/libs/components/components";
import { AppRoute } from "~/libs/enums/enums";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useNavigate,
	useState,
	useTranslation,
} from "~/libs/hooks/hooks";
import { logout } from "~/modules/auth/auth";

import { CodeConfirmForm } from "./code-confirm-form";
import { PasswordConfirmForm } from "./password-confirm-form";
import styles from "./styles.module.css";

const DeleteAccountSection: React.FC = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const user = useAppSelector((state) => state.auth.user);

	const handleOpenModal = useCallback((): void => {
		setIsModalOpen(true);
	}, []);

	const handleCloseModal = useCallback((): void => {
		setIsModalOpen(false);
	}, []);

	const handleDeleted = useCallback((): void => {
		const finishSession = async (): Promise<void> => {
			toast.success(t("profile.deleteAccount.success"));
			// The account is gone server-side; the logout thunk swallows the 401
			// from the already-revoked token and still clears the local session.
			await dispatch(logout());
			await navigate(AppRoute.ROOT);
		};

		void finishSession();
	}, [dispatch, navigate, t]);

	if (!user) {
		return null;
	}

	return (
		<div className={styles["card"]}>
			<h2 className={styles["card__title"]}>{t("profile.deleteAccount.title")}</h2>
			<p className={styles["card__description"]}>{t("profile.deleteAccount.description")}</p>

			<Button onClick={handleOpenModal} size="md" type="button" variant="danger">
				{t("profile.deleteAccount.button")}
			</Button>

			<Modal
				closeOnBackdropClick={false}
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title={t("profile.deleteAccount.modalTitle")}
			>
				{user.has_password ? (
					<PasswordConfirmForm onCancel={handleCloseModal} onDeleted={handleDeleted} />
				) : (
					<CodeConfirmForm onCancel={handleCloseModal} onDeleted={handleDeleted} />
				)}
			</Modal>
		</div>
	);
};

export { DeleteAccountSection };
