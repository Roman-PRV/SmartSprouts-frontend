import { createBrowserRouter } from "react-router-dom";

import { App } from "~/app.js";
import { MainLayout } from "~/libs/components/components";
import {
	GameContentPage,
	GameSelectionPage,
	HomePage,
	LoginPage,
	ProfilePage,
	SignupPage,
} from "~/pages/pages";

export const router = createBrowserRouter([
	{
		children: [
			{
				children: [
					{ element: <HomePage />, path: "" },
					{ element: <GameSelectionPage />, path: "games" },
					{ element: <GameContentPage />, path: "games/:id" },
					{ element: <ProfilePage />, path: "profile" },
				],
				element: <MainLayout />,
			},
		],
		element: <App />,
		path: "/",
	},
	{ element: <LoginPage />, path: "/login" },
	{ element: <SignupPage />, path: "/signup" },
]);
