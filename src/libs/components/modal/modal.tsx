import { getValidClassNames } from "~/libs/helpers/helpers";
import { useCallback, useEffect, useId, useRef, useTranslation } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";

type Properties = {
	children: React.ReactNode;
	className?: string;
	/** Close when the backdrop is clicked. Disable for data-entry modals to avoid losing input. */
	closeOnBackdropClick?: boolean;
	isOpen: boolean;
	onClose: () => void;
	title?: string;
};

const Modal: React.FC<Properties> = ({
	children,
	className,
	closeOnBackdropClick = true,
	isOpen,
	onClose,
	title,
}) => {
	const { t } = useTranslation();
	const titleId = useId();
	const dialogReference = useRef<HTMLDialogElement>(null);
	const isClosingFromPropertyReference = useRef(false);

	useEffect(() => {
		const dialog = dialogReference.current;

		if (!dialog) {
			return;
		}

		if (isOpen && !dialog.open) {
			dialog.showModal();
		} else if (!isOpen && dialog.open) {
			isClosingFromPropertyReference.current = true;
			dialog.close();
		}
	}, [isOpen]);

	useEffect(() => {
		const dialog = dialogReference.current;

		if (!dialog || !closeOnBackdropClick) {
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
	}, [closeOnBackdropClick]);

	const handleCloseClick = useCallback(() => {
		dialogReference.current?.close();
	}, []);

	const handleDialogClose = useCallback(() => {
		if (isClosingFromPropertyReference.current) {
			isClosingFromPropertyReference.current = false;

			return;
		}

		onClose();
	}, [onClose]);

	return (
		<dialog
			aria-labelledby={title ? titleId : undefined}
			className={getValidClassNames(styles["modal"], className)}
			onClose={handleDialogClose}
			ref={dialogReference}
		>
			{title && (
				<header className={styles["modal__header"]}>
					<h2 className={styles["modal__title"]} id={titleId}>
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
