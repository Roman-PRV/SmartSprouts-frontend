import { createBrowserRouter } from "react-router-dom";

import { App } from "~/app";
import { MainLayout } from "~/libs/components/components";
import { AppRoute } from "~/libs/enums/enums";
import { LevelContentPage } from "~/pages/level-content-page/level-content-page";
import {
	GameContentPage,
	GameSelectionPage,
	HomePage,
	LoginPage,
	ProfilePage,
	RegisterPage,
} from "~/pages/pages";

import { GuestRoute } from "../guest-route/guest-route";
import { ProtectedRoute } from "../protected-route/protected-route";

export const router = createBrowserRouter([
	{
		children: [
			{
				children: [
					{ element: <HomePage />, index: true },
					{
						children: [
							{ element: <GameSelectionPage />, path: AppRoute.GAMES },
							{ element: <GameContentPage />, path: AppRoute.GAME_CONTENT },
							{
								element: <LevelContentPage />,
								path: AppRoute.LEVEL_CONTENT,
							},
							{ element: <ProfilePage />, path: AppRoute.PROFILE },
						],
						element: <ProtectedRoute />,
					},
				],
				element: <MainLayout />,
			},
		],
		element: <App />,
		path: AppRoute.ROOT,
	},
	{
		children: [
			{ element: <LoginPage />, path: AppRoute.LOGIN },
			{ element: <RegisterPage />, path: AppRoute.REGISTER },
		],
		element: <GuestRoute />,
	},
]);
