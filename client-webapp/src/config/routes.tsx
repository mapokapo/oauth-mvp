import { Navigate, RouteObject } from "react-router";
import CallbackPage from "../page/callback-page";
import LoginPage from "../page/login-page";
import ProfilePage from "../page/profile-page";
import RegisterPage from "../page/register-page";
import RootLayout from "../layouts/root-layout";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/callback",
        element: <CallbackPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "*",
        element: <Navigate to="/login" replace />,
      },
    ],
  },
];
