import { type FieldPath, type FieldValues, type UseFormRegister } from "react-hook-form";

import { Textarea } from "~/libs/components/components";
import { useTranslation } from "~/libs/hooks/hooks";
import { AVAILABLE_LANGUAGES, type Language } from "~/libs/modules/localization/localization";

type Properties<TFieldValues extends FieldValues> = Readonly<{
	errors: Partial<Record<Language, undefined | { message?: string }>> | undefined;
	fieldName: FieldPath<TFieldValues>;
	getLabel: (lang: Language) => string;
	register: UseFormRegister<TFieldValues>;
	required?: boolean;
}>;

/**
 * Renders one Textarea per supported language for a localized body field.
 * Textarea sibling of LocalizedInputGroup, for fields whose text can be long.
 */
function LocalizedTextareaGroup<TFieldValues extends FieldValues>({
	errors,
	fieldName,
	getLabel,
	register,
	required = false,
}: Properties<TFieldValues>): React.ReactElement {
	const { t } = useTranslation();

	return (
		<>
			{AVAILABLE_LANGUAGES.map((lang) => {
				const message = errors?.[lang]?.message;

				return (
					<Textarea
						error={message ? t(message) : undefined}
						key={lang}
						label={getLabel(lang)}
						required={required}
						{...register(`${fieldName}.${lang}` as FieldPath<TFieldValues>)}
					/>
				);
			})}
		</>
	);
}

export { LocalizedTextareaGroup };
