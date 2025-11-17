import { type GameDescriptionDto } from "./game-description-dto.type";

type GamePreviewComponent = (properties: { game: GameDescriptionDto }) => React.JSX.Element;

export { type GamePreviewComponent };
