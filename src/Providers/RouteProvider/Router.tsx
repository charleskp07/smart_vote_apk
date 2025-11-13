import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../../pages/Home/Home";
import Login from "../../pages/Auth/Login/Login";
import TwoFactor from "../../pages/Auth/TwoFactor/TwoFactor";
import Dashboard from "../../pages/Admin/Dashboard/Dashboard";
import OrganizerDashboard from "../../pages/Organizer/Dashboard/Dashboard";
import VoterReadCompetition from "../../pages/Voter/Competition/Read/Read";
import VoterReadCandidate from "../../pages/Voter/Candidate/Read/Read";
import UserList from "../../pages/Admin/Users/List/List";
import AdminListCompetition from "../../pages/Admin/Competitons/List/List";
import OrginizerListCompetition from "../../pages/Organizer/Competitons/List/List";



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
        path: '/admin/dashboard',
        element: <Dashboard />
    },
    {
        path: '/organizer/dashboard',
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
        path: '/admin/competitions',
        children: [
            {
                index: true,
                element: <AdminListCompetition />
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
        path: '/admin/candidates',
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
        path: '/admin/users',
        children: [
            {
                index: true,
                element: <UserList />
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
        path: '/organizer/competitions',
        children: [
            {
                index: true,
                element: <OrginizerListCompetition />
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
        path: '/organizer/candidates',
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