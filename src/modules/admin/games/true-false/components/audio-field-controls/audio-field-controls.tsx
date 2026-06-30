import { useTranslation } from "~/libs/hooks/hooks";
import { AVAILABLE_LANGUAGES } from "~/libs/modules/localization/localization";

import { type useTrueFalseAudio } from "../../hooks/hooks";
import { type AudioStatusMap } from "../../libs/types/types";
import { AudioLocaleControl } from "./audio-locale-control";
import styles from "./styles.module.css";

type Properties = {
	audio: ReturnType<typeof useTrueFalseAudio>;
	audioMap: AudioStatusMap | undefined;
	field: string;
	label: string;
	scope: string;
};

/**
 * Renders one preview + regenerate control per locale for a single TTS field.
 * Reused by the statement form (statement, explanation) and the level forms
 * (title; text level also: text). The (scope, field) pair binds each row to the
 * shared audio hook.
 */
const AudioFieldControls: React.FC<Properties> = ({ audio, audioMap, field, label, scope }) => {
	const { t } = useTranslation();

	return (
		<div className={styles["audio-field"]}>
			<span className={styles["audio-field__label"]}>{label}</span>
			<ul className={styles["audio-field__locales"]}>
				{AVAILABLE_LANGUAGES.map((locale) => {
					const status = audioMap?.[locale];

					return (
						<AudioLocaleControl
							field={field}
							isGenerating={audio.isGenerating(scope, field, locale)}
							isStale={status?.is_stale ?? false}
							key={locale}
							label={t("admin.trueFalse.audio.regenerateLabel", { field: label, locale })}
							locale={locale}
							onRegenerate={audio.regenerate}
							scope={scope}
							url={status?.url ?? null}
						/>
					);
				})}
			</ul>
		</div>
	);
};

export { AudioFieldControls };
