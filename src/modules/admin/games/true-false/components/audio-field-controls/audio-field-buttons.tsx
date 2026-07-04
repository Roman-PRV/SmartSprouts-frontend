import { AudioPlayButton } from "~/libs/components/components";
import { useCallback, useTranslation } from "~/libs/hooks/hooks";
import { type Language } from "~/libs/modules/localization/localization";

import { type useTrueFalseAudio } from "../../hooks/hooks";
import { deriveAudioState } from "../../libs/helpers/derive-audio-state.helper";
import { type AudioStatus } from "../../libs/types/types";
import { AudioRegenButton } from "./audio-regen-button";
import styles from "./styles.module.css";

type Properties = {
	audio: ReturnType<typeof useTrueFalseAudio>;
	field: string;
	fieldLabel: string;
	locale: Language;
	scope: string;
	status: AudioStatus | undefined;
};

/**
 * Preview + regenerate buttons for one (scope, field, locale), rendered
 * directly under the matching localized input. Binds the regenerate handler
 * with a stable callback so it satisfies the no-inline-arrow rule.
 */
const AudioFieldButtons: React.FC<Properties> = ({
	audio,
	field,
	fieldLabel,
	locale,
	scope,
	status,
}) => {
	const { t } = useTranslation();

	const handleRegenerate = useCallback(() => {
		audio.regenerate(scope, field, locale);
	}, [audio, field, locale, scope]);

	const isGenerating = audio.isGenerating(scope, field, locale);
	const state = deriveAudioState(status, isGenerating);

	return (
		<div className={styles["audio-buttons"]}>
			<AudioPlayButton url={isGenerating ? null : status?.url ?? null} />
			<AudioRegenButton
				label={t("admin.trueFalse.audio.regenerateLabel", { field: fieldLabel, locale })}
				onRegenerate={handleRegenerate}
				state={state}
			/>
		</div>
	);
};

export { AudioFieldButtons };
