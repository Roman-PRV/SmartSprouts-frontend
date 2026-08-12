import { type ContentSectionData } from "./libs/types/content-section-data.type";
import styles from "./styles.module.css";

const ContentSection: React.FC<ContentSectionData> = ({ closing, heading, items, paragraphs }) => {
	return (
		<section className={styles["content-section"]}>
			<h2 className={styles["content-section__heading"]}>{heading}</h2>
			{paragraphs?.map((paragraph) => (
				<p className={styles["content-section__paragraph"]} key={paragraph}>
					{paragraph}
				</p>
			))}
			{items && (
				<ul className={styles["content-section__list"]}>
					{items.map((item) => (
						<li className={styles["content-section__list-item"]} key={item}>
							{item}
						</li>
					))}
				</ul>
			)}
			{closing?.map((paragraph) => (
				<p className={styles["content-section__paragraph"]} key={paragraph}>
					{paragraph}
				</p>
			))}
		</section>
	);
};

export { ContentSection };
