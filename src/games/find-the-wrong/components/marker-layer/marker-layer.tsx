import { type CanvasCoordsApi } from "~/libs/types/types";

import { type Marker } from "../../libs/types/types";
import { MarkerX } from "./marker-x";

type Properties = {
	coords: CanvasCoordsApi;
	markers: Marker[];
	readOnly?: boolean;
};

const MarkerLayer: React.FC<Properties> = ({ coords, markers, readOnly = false }) => {
	return (
		<>
			{markers.map((marker) => (
				<MarkerX coords={coords} key={marker.id} marker={marker} readOnly={readOnly} />
			))}
		</>
	);
};

export { MarkerLayer };
