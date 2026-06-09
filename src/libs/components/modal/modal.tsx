import { getValidClassNames } from "~/libs/helpers/helpers";
import { useCallback, useEffect, useRef, useTranslation } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";

const TITLE_ID = "modal-title";

type Properties = {
	children: React.ReactNode;
	className?: string;
	isOpen: boolean;
	onClose: () => void;
	title?: string;
};

const Modal: React.FC<Properties> = ({ children, className, isOpen, onClose, title }) => {
	const { t } = useTranslation();
	const dialogReference = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogReference.current;

		if (!dialog) {
			return;
		}

		if (isOpen && !dialog.open) {
			dialog.showModal();
		} else if (!isOpen && dialog.open) {
			dialog.close();
		}
	}, [isOpen]);

	useEffect(() => {
		const dialog = dialogReference.current;

		if (!dialog) {
			return;
		}

		const handleBackdropClick = (event: MouseEvent): void => {
			if (event.target === dialog) {
				dialog.close();
			}
		};

		dialog.addEventListener("click", handleBackdropClick);

		return (): void => {
			dialog.removeEventListener("click", handleBackdropClick);
		};
	}, []);

	const handleCloseClick = useCallback(() => {
		dialogReference.current?.close();
	}, []);

	return (
		<dialog
			aria-labelledby={title ? TITLE_ID : undefined}
			className={getValidClassNames(styles["modal"], className)}
			onClose={onClose}
			ref={dialogReference}
		>
			{title && (
				<header className={styles["modal__header"]}>
					<h2 className={styles["modal__title"]} id={TITLE_ID}>
						{title}
					</h2>
					<button
						aria-label={t("common.accessibility.close")}
						className={styles["modal__close"]}
						onClick={handleCloseClick}
						type="button"
					>
						×
					</button>
				</header>
			)}
			<div className={styles["modal__body"]}>{children}</div>
		</dialog>
	);
};

export { Modal };
