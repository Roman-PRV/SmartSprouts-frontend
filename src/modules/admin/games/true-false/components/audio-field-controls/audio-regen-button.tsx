import { getValidClassNames } from "~/libs/helpers/helpers";
import { useTranslation } from "~/libs/hooks/hooks";

import { type AudioState } from "../../libs/helpers/derive-audio-state.helper";
import styles from "./styles.module.css";

type Properties = {
	label: string;
	onRegenerate: () => void;
	state: AudioState;
};

const STATUS_TEXT_KEY: Record<AudioState, string> = {
	fresh: "admin.trueFalse.audio.fresh",
	generating: "admin.trueFalse.audio.generating",
	missing: "admin.trueFalse.audio.missing",
	stale: "admin.trueFalse.audio.regenerate",
};

/**
 * Per-(field, locale) regeneration control. Enabled for `stale` (text changed)
 * and `missing` (audio never produced) so admins can always recover; disabled
 * for `fresh` and while `generating`. The frontend reads the backend state only
 * — it never recomputes the hash.
 */
const AudioRegenButton: React.FC<Properties> = ({ label, onRegenerate, state }) => {
	const { t } = useTranslation();

	const isGenerating = state === "generating";
	const isRegeneratable = state === "missing" || state === "stale";

	return (
		<button
			aria-busy={isGenerating}
			aria-label={label}
			className={getValidClassNames(
				styles["regen-button"],
				isRegeneratable && styles["regen-button--stale"],
				isGenerating && styles["regen-button--generating"]
			)}
			disabled={!isRegeneratable}
			onClick={onRegenerate}
			type="button"
		>
			{isGenerating && <span className={styles["regen-button__spinner"]} role="status" />}
			{t(STATUS_TEXT_KEY[state])}
		</button>
	);
};

export { AudioRegenButton };
