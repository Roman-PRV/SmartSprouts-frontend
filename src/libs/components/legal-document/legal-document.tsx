import { LEGAL_DOCUMENTS_VERSION } from "~/libs/constants/constants";
import { useTranslation } from "~/libs/hooks/hooks";

import { type LegalSection } from "./libs/types/legal-section.type";
import styles from "./styles.module.css";

type Properties = {
	documentKey: "privacy" | "terms";
};

const LegalDocument: React.FC<Properties> = ({ documentKey }) => {
	const { t } = useTranslation();
	const sections = t(`legal.${documentKey}.sections`, {
		returnObjects: true,
	}) as LegalSection[];

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
				<section className={styles["legal-document__section"]} key={section.heading}>
					<h2 className={styles["legal-document__heading"]}>{section.heading}</h2>
					{section.paragraphs?.map((paragraph) => (
						<p className={styles["legal-document__paragraph"]} key={paragraph}>
							{paragraph}
						</p>
					))}
					{section.items && (
						<ul className={styles["legal-document__list"]}>
							{section.items.map((item) => (
								<li className={styles["legal-document__list-item"]} key={item}>
									{item}
								</li>
							))}
						</ul>
					)}
					{section.closing?.map((paragraph) => (
						<p className={styles["legal-document__paragraph"]} key={paragraph}>
							{paragraph}
						</p>
					))}
				</section>
			))}

			<p className={styles["legal-document__language-note"]}>{t("legal.languageNote")}</p>
		</article>
	);
};

export { LegalDocument };
