import { Outlet } from "react-router-dom";

import { Footer, Header } from "~/libs/components/components";
import { getValidClassNames } from "~/libs/helpers/helpers";

import styles from "./styles.module.css";

const MainLayout: React.FC = () => {
	return (
		<div className={getValidClassNames(styles["layout__container"], "flex flex-col")}>
			<Header />
			<main className={getValidClassNames(styles["layout__main"], "flex-1 p-4 sm:p-6 lg:p-8")}>
				<Outlet />
			</main>

			<Footer />
		</div>
	);
};

export { MainLayout };
