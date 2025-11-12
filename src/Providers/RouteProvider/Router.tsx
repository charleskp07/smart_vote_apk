import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../../pages/Home/Home";
import Login from "../../pages/Auth/Login/Login";
import TwoFactor from "../../pages/Auth/TwoFactor/TwoFactor";
import Dashboard from "../../pages/Admin/Dashboard/Dashboard";
import OrganizerDashboard from "../../pages/Organizer/Dashboard/Dashboard";
import VoterReadCompetition from "../../pages/Voter/Competition/Read/Read";
import VoterReadCandidate from "../../pages/Voter/Candidate/Read/Read";



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
        path: '/voter/competitions/:id/read',
        element: <VoterReadCompetition />
    },
    {
        path: '/voter/candidates/:id/read',
        element: <VoterReadCandidate />
    },
    {
        path: '/competitions',
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