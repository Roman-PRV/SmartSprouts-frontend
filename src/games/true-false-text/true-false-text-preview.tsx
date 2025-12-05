import { type GameDescriptionDto } from "~/libs/types/types";

type Properties = { game: GameDescriptionDto };

const TrueFalseTextPreview: React.FC<Properties> = ({ game }) => {
	return <div>TrueFalseTextPreview {game.description}</div>;
};

export { TrueFalseTextPreview };
