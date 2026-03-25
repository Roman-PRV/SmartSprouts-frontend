import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAudioPlayer, useCallback } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";

type Properties = {
	className?: string;
	url: null | string;
};

/**
 * A reusable button for playing TTS audio.
 * Displays "playing" state and handles "stop/toggle" via useAudioPlayer.
 * Renders in a disabled state if url is null or empty.
 */
const AudioPlayButton: React.FC<Properties> = ({ className, url }) => {
	const { isPlaying, toggle} = useAudioPlayer(url ?? undefined);

	const handleToggle = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>): void => {
			event.preventDefault();
			event.stopPropagation();

			if (url) {
				toggle();
			}
		},
		[toggle, url]
	);

	const isDisabled = !url;

	return (
		<button
			aria-label={isPlaying ? "Stop audio" : "Play audio"}
			aria-pressed={isPlaying}
			className={getValidClassNames(
				styles["audio-button"],
				isPlaying && styles["audio-button--playing"],
				isDisabled && styles["audio-button--disabled"],
				className
			)}
			disabled={isDisabled}
			onClick={handleToggle}
			type="button"
		>
			<span className={styles["audio-button__icon"]}> {isPlaying ? "⏹️" : "🔊"}</span>
		</button>
	);
};

export { AudioPlayButton };
