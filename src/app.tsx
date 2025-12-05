import { Outlet } from "react-router-dom";

const App: React.FC = () => {
	return (
		<>
			{/* TODO Loader */}
			{/* TODO Check authorization */}
			<Outlet />
		</>
	);
};

export { App };
