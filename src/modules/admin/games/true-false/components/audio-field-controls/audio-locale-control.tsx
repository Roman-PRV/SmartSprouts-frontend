import { AudioPlayButton } from "~/libs/components/components";
import { useCallback } from "~/libs/hooks/hooks";
import { type Language } from "~/libs/modules/localization/localization";

import { AudioRegenButton } from "./audio-regen-button";
import styles from "./styles.module.css";

type Properties = {
	field: string;
	isGenerating: boolean;
	isStale: boolean;
	label: string;
	locale: Language;
	onRegenerate: (scope: string, field: string, locale: Language) => void;
	scope: string;
	url: null | string;
};

/**
 * One locale's audio row: preview + regenerate. Binds the scope/field/locale to
 * the shared regenerate handler with a stable callback (no inline JSX arrows).
 */
const AudioLocaleControl: React.FC<Properties> = ({
	field,
	isGenerating,
	isStale,
	label,
	locale,
	onRegenerate,
	scope,
	url,
}) => {
	const handleRegenerate = useCallback(() => {
		onRegenerate(scope, field, locale);
	}, [field, locale, onRegenerate, scope]);

	return (
		<li className={styles["audio-field__locale"]}>
			<span className={styles["audio-field__locale-code"]}>{locale}</span>
			<AudioPlayButton url={url} />
			<AudioRegenButton
				isGenerating={isGenerating}
				isStale={isStale}
				label={label}
				onRegenerate={handleRegenerate}
			/>
		</li>
	);
};

export { AudioLocaleControl };
