import { lazy } from "react";
import { RequireAuth } from "react-auth-kit";

import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/full-layout"));


/***** Pages ****/
const Dashboard = lazy(() => import("../pages/1-dashboard"));
const Login = lazy(() => import("../pages/0-login"));
const Search = lazy(() => import("../pages/2-search"));
const Profile = lazy(() => import("../pages/5-profile"));

const Users = lazy(() => import("../pages/3-users"));
const VerifyCodeToReset = lazy(() => import("../pages/4-reset-password"));


const Register = lazy(() => import("../pages/0.1-register"));
const RegisterClient = lazy(() => import("../pages/0.2-register-client"));

const Tickets = lazy(() => import("../pages/6-tickets"));
const ValidateUser = lazy(() => import("../pages/7-validate-user"));

const UpdatePassword = lazy(() => import("../pages/8-user-update-password"));
const Projects = lazy(() => import("../pages/9-projects"));
const Editprofile = lazy(() => import("../pages/5.1-edit-profile"));
const AddProject = lazy(() => import("../pages/10-add-project"));
const ProjectDetails = lazy(() => import("../pages/11-project-details"));
const UpdateProject = lazy(() => import("../pages/12-update-project"));
const TicketDetails = lazy(() => import("../pages/6.1-ticket_details"));
const Notifications = lazy(() => import("../pages/13-notifications"));





/*****Routes******/

const Routes = [
  {
    path: "/",
    element: <RequireAuth loginPath="/login">
      <FullLayout />
    </RequireAuth>,
    children: [
      { path: "/", element: <Navigate to="/login" /> },
      { path: "/dashboard", exact: true, element: <Dashboard /> },
      { path: "/search", exact: true, element: <Search /> },
      { path: "/users", exact: true, element: <Users /> },
      { path: "/projects", exact: true, element: <Projects /> },
      { path: "/projects/:id/tickets", exact: true, element: <Tickets /> },
      { path: "/ticketDetails/:TicketId", exact: true, element: <TicketDetails /> },

      { path: "/profile/:userId", exact: true, element: <Profile /> },      
      { path: "/validateUser/:id", exact: true, element: <ValidateUser /> },
      { path: "/UpdatePassword", exact: true, element: <UpdatePassword /> },
      { path: "/Editprofile", exact: true, element: <Editprofile /> },
      { path: "/addProject", exact: true, element: <AddProject /> },
      { path: "/projectDetails/:projectId", exact: true, element: <ProjectDetails /> },
      { path: "/updateProject/:projectId", exact: true, element: <UpdateProject /> },
      { path: "/notifications", exact: true, element: <Notifications /> }

      
      
    
    ],
  },


  { path: "/login", exact: true, element: <Login /> },
  { path: "/Register", exact: true, element: <Register /> },
  { path: "/RegisterClient", exact: true, element: <RegisterClient /> },
  { path: "/reset-password", exact: true, element: <VerifyCodeToReset /> },


];

export default Routes;
