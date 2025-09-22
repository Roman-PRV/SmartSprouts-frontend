import { Outlet } from "react-router-dom";

import { Footer, Header } from "~/libs/components/components";

import styles from "./styles.module.css";

const MainLayout: React.FC = () => {
	return (
		<div className={styles["layout__container"]}>
			<Header />
			<main className="flex-1 p-4 sm:p-6 lg:p-8">
				<Outlet />
			</main>

			<Footer />
		</div>
	);
};

export { MainLayout };
