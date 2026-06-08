import { type CanvasCoordsApi, type Stroke } from "~/libs/types/types";

import { StrokeLine } from "./stroke-line";

type Properties = {
	coords: CanvasCoordsApi;
	strokes: Stroke[];
};

const StrokeLayer: React.FC<Properties> = ({ coords, strokes }) => {
	return (
		<>
			{strokes.map((stroke) => (
				<StrokeLine coords={coords} key={stroke.id} stroke={stroke} />
			))}
		</>
	);
};

export { StrokeLayer };
