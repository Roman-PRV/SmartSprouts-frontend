import defaultPlaceholder from "~/assets/img/default-icon.svg";
import { useCallback, useEffect, useState } from "~/libs/hooks/hooks";

type Properties = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
	alt: string;
	fallbackSrc?: string;
	src: string;
};

/**
 * Drop-in replacement for <img> that swaps to a bundled placeholder when the
 * source fails to load. The backend returns canonical URLs without checking the
 * file exists, so a missing asset surfaces as a 404; this keeps the UI from
 * showing the browser's broken-image glyph.
 */
const FallbackImage: React.FC<Properties> = ({
	alt,
	fallbackSrc: fallbackSource = defaultPlaceholder,
	src,
	...rest
}) => {
	const [currentSource, setCurrentSource] = useState(src);

	useEffect(() => {
		setCurrentSource(src);
	}, [src]);

	const handleError = useCallback((): void => {
		setCurrentSource((previous) => (previous === fallbackSource ? previous : fallbackSource));
	}, [fallbackSource]);

	return <img {...rest} alt={alt} onError={handleError} src={currentSource} />;
};

export { FallbackImage };
