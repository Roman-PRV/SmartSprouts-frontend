import { useTranslation } from "~/libs/hooks/hooks";

import { ABOUT_STACK } from "./libs/constants/about-stack.constant";
import { type AboutSection } from "./libs/types/about-section.type";
import styles from "./styles.module.css";

const AboutPage: React.FC = () => {
	const { t } = useTranslation();
	const sections = t("about.sections", { returnObjects: true }) as AboutSection[];

	return (
		<article className={styles["about"]}>
			<h1 className={styles["about__title"]}>{t("about.hero.title")}</h1>
			<p className={styles["about__intro"]}>{t("about.hero.intro")}</p>

			{sections.map((section) => (
				<section className={styles["about__section"]} key={section.heading}>
					<h2 className={styles["about__heading"]}>{section.heading}</h2>
					{section.paragraphs?.map((paragraph) => (
						<p className={styles["about__paragraph"]} key={paragraph}>
							{paragraph}
						</p>
					))}
					{section.items && (
						<ul className={styles["about__list"]}>
							{section.items.map((item) => (
								<li className={styles["about__list-item"]} key={item}>
									{item}
								</li>
							))}
						</ul>
					)}
				</section>
			))}

			<section className={styles["about__section"]}>
				<h2 className={styles["about__heading"]}>{t("about.stack.heading")}</h2>
				<dl className={styles["about__stack"]}>
					{ABOUT_STACK.map((group) => (
						<div className={styles["about__stack-group"]} key={group.key}>
							<dt className={styles["about__stack-label"]}>
								{t(`about.stack.labels.${group.key}`)}
							</dt>
							<dd className={styles["about__stack-items"]}>{group.items.join(" · ")}</dd>
						</div>
					))}
				</dl>
			</section>
		</article>
	);
};

export { AboutPage };
