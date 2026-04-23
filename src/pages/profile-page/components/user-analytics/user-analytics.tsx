import styles from "./styles.module.css";

type Properties = {
	items: {
		label: string;
		value: number | string;
	}[];
};

const UserAnalytics: React.FC<Properties> = ({ items }) => {
	return (
		<dl className={styles["analytics"]}>
			{items.map(({ label, value }) => (
				<div className={styles["analytics__item"]} key={label}>
					<dt className={styles["analytics__label"]}>{label}</dt>
					<dd className={styles["analytics__value"]}>{value}</dd>
				</div>
			))}
		</dl>
	);
};

export { UserAnalytics };
