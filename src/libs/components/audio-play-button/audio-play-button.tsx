import { Icon } from "~/libs/components/components";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAudioPlayer, useCallback, useStopAudioOnUnmount } from "~/libs/hooks/hooks";

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
	const { isPlaying, toggle } = useAudioPlayer(url ?? undefined);
	useStopAudioOnUnmount(url ?? undefined);

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
			aria-label={isPlaying ? "Pause audio" : "Play audio"}
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
			<span className={styles["audio-button__icon"]}>
				<Icon name={isPlaying ? "pause" : "sound"} />
			</span>
		</button>
	);
};

export { AudioPlayButton };
