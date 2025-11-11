import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../../pages/Home/Home";
import Login from "../../pages/Auth/Login/Login";
import TwoFactor from "../../pages/Auth/TwoFactor/TwoFactor";
import Dashboard from "../../pages/Admin/Dashboard/Dashboard";
import OrganizerDashboard from "../../pages/Organizer/Dashboard/Dashboard";



const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/two-factor',
        element: <TwoFactor />
    },
    {
        path: '/dashboard',
        element: <Dashboard />
    },
    {
        path: '/organizer-dashboard',
        element: <OrganizerDashboard />
    },
    {
        path: '/candidates',
        children: [
            {
                index: true,
                // element: 
            },
            {
                path: "create",
                // element: 
            },
            {
                path: ":id/read",
                // element: 
            },
        ]
        
    },
])

const Router = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Router;