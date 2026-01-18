import { Outlet } from "react-router-dom";

const App: React.FC = () => {
	return (
		<>
			{/* TODO Loader */}
			<Outlet />
		</>
	);
};

export { App };
