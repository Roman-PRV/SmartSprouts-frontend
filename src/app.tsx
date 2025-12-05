import { useCallback, useState } from "react";

import "./app.css";
import ReactLogo from "./assets/react.svg";
import ViteLogo from "./assets/vite.svg";

const App: React.FC = () => {
	const INITIAL_COUNT = 0;
	const INCREMENT = 1;
	const [count, setCount] = useState(INITIAL_COUNT);

	const handleClick = useCallback((): void => {
		setCount((c) => c + INCREMENT);
	}, []);

	return (
		<>
			<div>
				<a href="https://vite.dev" rel="noreferrer" target="_blank">
					<img alt="Vite logo" className="logo" src={ViteLogo} />
				</a>
				<a href="https://react.dev" rel="noreferrer" target="_blank">
					<img alt="React logo" className="logo react" src={ReactLogo} />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={handleClick}>count is {count}</button>
				<p></p>
			</div>
			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
		</>
	);
};

export { App };
