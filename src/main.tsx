import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { RouterProvider } from "react-router-dom";

import { App } from "./app.js";
import { router } from "./libs/components/router-provider/router-provider";

const root = document.querySelector("#root");

if (!root) {
	throw new Error("Root element not found");
}

createRoot(root).render(
	<StrictMode>
		<RouterProvider router={router} />
		<App />
	</StrictMode>
);
