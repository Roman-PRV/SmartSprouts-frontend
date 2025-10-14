import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as StoreProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { router } from "~/libs/components/components";
import { store } from "~/libs/modules/store/store";

import "./assets/css/styles.css";

const root = document.querySelector("#root");

if (!root) {
	throw new Error("Root element not found");
}

createRoot(root).render(
	<StrictMode>
		<StoreProvider store={store.instance}>
			<RouterProvider router={router} />
		</StoreProvider>
	</StrictMode>
);
