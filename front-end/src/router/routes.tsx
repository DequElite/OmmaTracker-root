import { JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "../pages/Home/HomePage";
import RegisterPage from "../pages/Register/RegisterPage";
import SignInPage from "../pages/Register/SignIn/SignInPage";
import SignUpPage from "../pages/Register/SignUp/SignUpPage";
import ForgotPassword from "../pages/Register/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/Register/ForgotPassword/ResetPassword";
import AccountPage from "../pages/Account/AccountPage";
import TasksPage from "../pages/Tasks/TasksPage";
import ReviewTaskPage from "../pages/Tasks/Review/ReviewTaskPage";
import CreateTaskPage from "../pages/Tasks/Create/CreateTaskPage";
import ModerationPage from "../pages/Moderation/ModerationPage";
// import SignInAdmin from "../pages/Moderation/Admin/SignIn/SignInAdmin";
import SignInSA from "../pages/Moderation/SuperAdmin/SignInSA";
import LairSA from "../pages/Moderation/SuperAdmin/LairSA";
import ProtectedRoute from "./ProtectedRoute";

export interface RouteTypes {
    path: string;
    element: JSX.Element;
    children?: RouteTypes[];
}

export const Redirect = ({ pathname }: { pathname: string }) => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate(pathname);
    }, [navigate, pathname]);
    return null;
}

export const routes: RouteTypes[] = [
    {
        path: '/',
        element: <Redirect pathname="/home"/> 
    },
    {
        path:'/home',
        element: <HomePage />
    },
    {
        path:'/dashboard',
        element: <Redirect pathname="/dashboard/tasks"/>
    },
    {
        path:'/dashboard/account',
        element: <AccountPage />
    },
    {
        path: "/dashboard/tasks",
        element: <TasksPage />
    },
    {
        path: "/dashboard/tasks/review",
        element: <ReviewTaskPage />
    },
    {
        path: "/dashboard/tasks/create",
        element: <CreateTaskPage />
    },
    {
        path:'/register',
        element: <RegisterPage />,
        children: [
            {
                path:'signin',
                element: <SignInPage />
            }, 
            {
                path:'signup',
                element: <SignUpPage />
            },
            {
                path:'forgot-password',
                element: <ForgotPassword />
            },
            {
                path:'reset-password',
                element: <ResetPassword />
            }
        ]
    },
    {
        path:'/moderation',
        element: <ModerationPage />,
        children: [
            // {
            //     path:'admin',
            //     element: <Redirect pathname="/moderation"/>
            // }, 
            // {
            //     path:'admin/signin',
            //     element: <SignInAdmin />,
            // },
            {
                path:'super_admin/signin',
                element: <SignInSA />,
            }, 
            {
                path:'super_admin/lair',
                element: <ProtectedRoute Element={<LairSA />} />,
            }
        ]
    }
];
