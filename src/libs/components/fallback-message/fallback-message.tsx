import styles from "./styles.module.css";

type Properties = {
	message: string;
};

const FallbackMessage: React.FC<Properties> = ({ message }) => (
	<div className={styles["fallback-message"]} role="alert">
		<p>{message}</p>
	</div>
);

export { FallbackMessage };
