import React from "react";
import { Outlet } from "react-router-dom";

import { Footer } from "../../components/footer/footer.js";
import { Header } from "../../components/header/header.js";

const MainLayout: React.FC = () => {
	return (
		<>
			<Header />
			<main>
				<Outlet />
			</main>
			<Footer />
		</>
	);
};

export { MainLayout };
