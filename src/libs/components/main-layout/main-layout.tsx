import React from "react";
import { Outlet } from "react-router-dom";

import { Footer } from "../footer/footer.js";
import { Header } from "../header/header.js";
import "./styles.css";

const MainLayout: React.FC = () => {
	return (
		<div className="layout__container bg-amber-50">
			<Header />
			<main className="flex-1 p-4 sm:p-6 lg:p-8">
				<Outlet />
			</main>

			<Footer />
		</div>
	);
};

export { MainLayout };
