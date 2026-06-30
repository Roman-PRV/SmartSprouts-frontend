import { getValidClassNames } from "~/libs/helpers/helpers";
import { useTranslation } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";

type Properties = {
	isGenerating: boolean;
	isStale: boolean;
	label: string;
	onRegenerate: () => void;
};

/**
 * Per-(field, locale) regeneration control. Enabled only when the backend
 * reports the audio as stale and no request is in flight; the frontend never
 * recomputes the hash, it only reads `isStale`.
 */
const AudioRegenButton: React.FC<Properties> = ({ isGenerating, isStale, label, onRegenerate }) => {
	const { t } = useTranslation();
	const isDisabled = !isStale || isGenerating;

	let statusText = t("admin.trueFalse.audio.fresh");

	if (isGenerating) {
		statusText = t("admin.trueFalse.audio.generating");
	} else if (isStale) {
		statusText = t("admin.trueFalse.audio.regenerate");
	}

	return (
		<button
			aria-label={label}
			className={getValidClassNames(
				styles["regen-button"],
				isStale && !isGenerating && styles["regen-button--stale"],
				isGenerating && styles["regen-button--generating"]
			)}
			disabled={isDisabled}
			onClick={onRegenerate}
			type="button"
		>
			{statusText}
		</button>
	);
};

export { AudioRegenButton };
