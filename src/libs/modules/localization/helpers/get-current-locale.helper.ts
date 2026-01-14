import { Language } from "../enums/language.enum";
import { i18n } from "../i18n";

const getCurrentLocale = (): string => {
	return (i18n.language as string | undefined) ?? Language.EN;
};

export { getCurrentLocale };
