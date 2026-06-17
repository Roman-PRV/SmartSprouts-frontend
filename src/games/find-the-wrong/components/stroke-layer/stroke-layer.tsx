import { type CanvasCoordsApi, type Stroke } from "~/libs/types/types";

import { StrokeLine } from "./stroke-line";

type Properties = {
	coords: CanvasCoordsApi;
	highlightClosed?: boolean;
	strokes: Stroke[];
};

const StrokeLayer: React.FC<Properties> = ({ coords, highlightClosed = false, strokes }) => {
	return (
		<>
			{strokes.map((stroke) => (
				<StrokeLine
					coords={coords}
					highlightClosed={highlightClosed}
					key={stroke.id}
					stroke={stroke}
				/>
			))}
		</>
	);
};

export { StrokeLayer };
