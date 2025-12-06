import { type GameDescriptionDto } from "~/libs/types/types";

type Properties = { game: GameDescriptionDto };

const FindTheWrongPreview: React.FC<Properties> = ({ game }) => {
	return <div>FindTheWrongPreview {game.description}</div>;
};

export { FindTheWrongPreview };
