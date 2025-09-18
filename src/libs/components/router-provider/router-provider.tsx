import { createBrowserRouter } from "react-router-dom";

import { GamePage } from "../../../pages/game-page.js";
import { GameSelectionPage } from "../../../pages/game-selection-page";
import { HomePage } from "../../../pages/home-page";
import { LoginPage } from "../../../pages/login-page";
import { ProfilePage } from "../../../pages/profile-page";
import { SignupPage } from "../../../pages/signup-page";
import { MainLayout } from "../main-layout/main-layout.js";

export const router = createBrowserRouter([
	{
		children: [
			{ element: <HomePage />, path: "" },
			{ element: <GameSelectionPage />, path: "games" },
			{ element: <GamePage />, path: "games/:id" },
			{ element: <ProfilePage />, path: "profile" },
		],
		element: <MainLayout />,
		path: "/",
	},
	{ element: <LoginPage />, path: "/login" },
	{ element: <SignupPage />, path: "/signup" },
]);
