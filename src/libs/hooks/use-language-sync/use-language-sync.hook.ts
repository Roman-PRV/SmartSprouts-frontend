import { useEffect, useRef, useTranslation } from "~/libs/hooks/hooks";

const useLanguageSync = (callback: () => void): void => {
	const { i18n } = useTranslation();
	const lastLanguageReference = useRef(i18n.language);

	useEffect(() => {
		const isLanguageChanged = lastLanguageReference.current !== i18n.language;

		if (isLanguageChanged) {
			callback();
			lastLanguageReference.current = i18n.language;
		}
	}, [i18n.language, callback]);
};

export { useLanguageSync };
