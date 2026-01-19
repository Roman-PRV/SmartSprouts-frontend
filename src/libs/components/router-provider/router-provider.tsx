import { createBrowserRouter } from "react-router-dom";

import { App } from "~/app.js";
import { MainLayout } from "~/libs/components/components";
import { LevelContentPage } from "~/pages/level-content-page/level-content-page";
import {
	GameContentPage,
	GameSelectionPage,
	HomePage,
	LoginPage,
	ProfilePage,
	RegisterPage,
} from "~/pages/pages";

import { GuestRoute } from "../guest-route/guest-route.js";
import { ProtectedRoute } from "../protected-route/protected-route.js";

export const router = createBrowserRouter([
	{
		children: [
			{
				children: [
					{ element: <HomePage />, path: "" },
					{
						children: [
							{ element: <GameSelectionPage />, path: "games" },
							{ element: <GameContentPage />, path: "games/:id" },
							{ element: <LevelContentPage />, path: "games/:id/levels/:levelId" },
							{ element: <ProfilePage />, path: "profile" },
						],
						element: <ProtectedRoute />,
					},
				],
				element: <MainLayout />,
			},
		],
		element: <App />,
		path: "/",
	},
	{
		children: [
			{ element: <LoginPage />, path: "/login" },
			{ element: <RegisterPage />, path: "/register" },
		],
		element: <GuestRoute />,
	},
]);
