import { useParams } from "react-router-dom";

const GameContentPage: React.FC = () => {
	const { id } = useParams();

	return <h1>Game Content Page: {id}</h1>;
};

export { GameContentPage };
