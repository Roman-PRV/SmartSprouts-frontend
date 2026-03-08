import styles from "./styles.module.css";

type Properties = {
	message: string;
};

const FallbackMessage: React.FC<Properties> = ({ message }) => (
	<div className={styles["fallback-message"]}>
		<h1>{message}</h1>
	</div>
);

export { FallbackMessage };
