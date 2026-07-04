import { type FieldPath, type FieldValues, type UseFormRegister } from "react-hook-form";

import { Input } from "~/libs/components/input/input";
import { useId, useTranslation } from "~/libs/hooks/hooks";
import { AVAILABLE_LANGUAGES, type Language } from "~/libs/modules/localization/localization";

import { type useTrueFalseAudio } from "../../hooks/hooks";
import { type AudioStatusMap } from "../../libs/types/types";
import { AudioFieldButtons } from "./audio-field-buttons";
import styles from "./styles.module.css";

const TEXTAREA_ROWS = 4;

type Properties<TFieldValues extends FieldValues> = Readonly<{
	audio: ReturnType<typeof useTrueFalseAudio>;
	/** Backend audio field name used for regeneration (e.g. "title_audio_url"). */
	audioField: string;
	audioMap: AudioStatusMap | undefined;
	errors: Partial<Record<Language, undefined | { message?: string }>> | undefined;
	/** Short field label used in the regenerate button's accessible name. */
	fieldLabel: string;
	fieldName: FieldPath<TFieldValues>;
	getLabel: (lang: Language) => string;
	multiline?: boolean;
	register: UseFormRegister<TFieldValues>;
	required?: boolean;
	scope: string;
}>;

/**
 * Renders a localized field (one input/textarea per language) with the play +
 * regenerate audio controls placed directly under each language's input.
 */
function LocalizedAudioField<TFieldValues extends FieldValues>({
	audio,
	audioField,
	audioMap,
	errors,
	fieldLabel,
	fieldName,
	getLabel,
	multiline = false,
	register,
	required = false,
	scope,
}: Properties<TFieldValues>): React.ReactElement {
	const { t } = useTranslation();
	const baseId = useId();

	return (
		<>
			{AVAILABLE_LANGUAGES.map((lang) => {
				const id = `${baseId}-${lang}`;
				const errorId = `${id}-error`;
				const message = errors?.[lang]?.message;
				const path = `${fieldName}.${lang}` as FieldPath<TFieldValues>;

				return (
					<div className={styles["audio-field"]} key={lang}>
						{multiline ? (
							<div className={styles["audio-field__group"]}>
								<label className={styles["audio-field__label"]} htmlFor={id}>
									{getLabel(lang)}
									{required && <span className={styles["audio-field__required"]}> *</span>}
								</label>
								<textarea
									aria-invalid={Boolean(message)}
									className={styles["audio-field__textarea"]}
									id={id}
									rows={TEXTAREA_ROWS}
									{...(message && { "aria-describedby": errorId })}
									{...register(path)}
								/>
								{message && (
									<span className={styles["audio-field__error"]} id={errorId} role="alert">
										{t(message)}
									</span>
								)}
							</div>
						) : (
							<Input
								error={message ? t(message) : undefined}
								label={getLabel(lang)}
								required={required}
								size="sm"
								{...register(path)}
							/>
						)}

						<AudioFieldButtons
							audio={audio}
							field={audioField}
							fieldLabel={fieldLabel}
							locale={lang}
							scope={scope}
							status={audioMap?.[lang]}
						/>
					</div>
				);
			})}
		</>
	);
}

export { LocalizedAudioField };
