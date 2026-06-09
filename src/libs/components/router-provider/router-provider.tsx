import { createBrowserRouter } from "react-router-dom";

import { App } from "~/app";
import { MainLayout } from "~/libs/components/components";
import { AppRoute } from "~/libs/enums/enums";
import { AdminLayout, RequireAdmin } from "~/modules/admin/admin";
import { LevelContentPage } from "~/pages/level-content-page/level-content-page";
import {
	AdminLevelEditorPage,
	AdminLevelsListPage,
	AdminWelcomePage,
	AuthGoogleCallbackPage,
	GameContentPage,
	GameSelectionPage,
	HomePage,
	LoginPage,
	ProfilePage,
	RegisterPage,
} from "~/pages/pages";

import { GuestRoute } from "../guest-route/guest-route";
import { ProtectedRoute } from "../protected-route/protected-route";

const router = createBrowserRouter([
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
			{
				children: [
					{
						children: [
							{
								children: [
									{ element: <AdminWelcomePage />, index: true },
									{
										element: <AdminLevelsListPage />,
										path: AppRoute.ADMIN_GAME_LEVELS,
									},
									{
										element: <AdminLevelEditorPage />,
										path: AppRoute.ADMIN_GAME_LEVEL_EDITOR,
									},
								],
								element: <AdminLayout />,
								path: AppRoute.ADMIN_ROOT,
							},
						],
						element: <RequireAdmin />,
					},
				],
				element: <ProtectedRoute />,
			},
		],
		element: <App />,
		path: AppRoute.ROOT,
	},
	{
		children: [
			{ element: <AuthGoogleCallbackPage />, path: AppRoute.AUTH_GOOGLE_CALLBACK },
			{ element: <LoginPage />, path: AppRoute.LOGIN },
			{ element: <RegisterPage />, path: AppRoute.REGISTER },
		],
		element: <GuestRoute />,
	},
]);

export { router };
