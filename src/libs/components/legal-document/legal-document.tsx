import { LEGAL_DOCUMENTS_VERSION } from "~/libs/constants/constants";
import { useTranslation } from "~/libs/hooks/hooks";

import { ContentSection } from "../content-section/content-section";
import { type ContentSectionData } from "../content-section/libs/types/content-section-data.type";
import styles from "./styles.module.css";

type Properties = {
	documentKey: "privacy" | "terms";
};

const LegalDocument: React.FC<Properties> = ({ documentKey }) => {
	const { t } = useTranslation();
	const sections = t(`legal.${documentKey}.sections`, {
		returnObjects: true,
	}) as ContentSectionData[];

	return (
		<article className={styles["legal-document"]}>
			<p className={styles["legal-document__draft-banner"]}>{t("legal.draftBanner")}</p>
			<h1 className={styles["legal-document__title"]}>{t(`legal.${documentKey}.title`)}</h1>
			<p className={styles["legal-document__meta"]}>
				{t(`legal.${documentKey}.meta`, {
					effectiveDate: LEGAL_DOCUMENTS_VERSION,
					version: LEGAL_DOCUMENTS_VERSION,
				})}
			</p>

			{sections.map((section) => (
				<ContentSection
					closing={section.closing}
					heading={section.heading}
					items={section.items}
					key={section.heading}
					paragraphs={section.paragraphs}
				/>
			))}

			<p className={styles["legal-document__language-note"]}>{t("legal.languageNote")}</p>
		</article>
	);
};

export { LegalDocument };
