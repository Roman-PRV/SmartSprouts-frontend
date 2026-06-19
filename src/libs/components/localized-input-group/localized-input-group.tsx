import { type FieldPath, type FieldValues, type UseFormRegister } from "react-hook-form";

import { Input } from "~/libs/components/input/input";
import { type InputSize } from "~/libs/components/input/types";
import { useTranslation } from "~/libs/hooks/hooks";
import { AVAILABLE_LANGUAGES, type Language } from "~/libs/modules/localization/localization";

type Properties<TFieldValues extends FieldValues> = Readonly<{
	errorInterpolation?: Record<string, unknown>;
	errors: Partial<Record<Language, undefined | { message?: string }>> | undefined;
	fieldName: FieldPath<TFieldValues>;
	getLabel: (lang: Language) => string;
	getPlaceholder?: (lang: Language) => string;
	register: UseFormRegister<TFieldValues>;
	required?: boolean;
	size?: InputSize;
}>;

/**
 * Renders one Input per supported language for a localized text field.
 * Wires each input to the matching `<fieldName>.<lang>` path in react-hook-form.
 */
function LocalizedInputGroup<TFieldValues extends FieldValues>({
	errorInterpolation,
	errors,
	fieldName,
	getLabel,
	getPlaceholder,
	register,
	required = false,
	size = "md",
}: Properties<TFieldValues>): React.ReactElement {
	const { t } = useTranslation();

	return (
		<>
			{AVAILABLE_LANGUAGES.map((lang) => {
				const errorMessage = errors?.[lang]?.message;

				return (
					<Input
						error={errorMessage ? t(errorMessage, errorInterpolation ?? {}) : undefined}
						key={lang}
						label={getLabel(lang)}
						required={required}
						size={size}
						{...(getPlaceholder && { placeholder: getPlaceholder(lang) })}
						{...register(`${fieldName}.${lang}` as FieldPath<TFieldValues>)}
					/>
				);
			})}
		</>
	);
}

export { LocalizedInputGroup };
