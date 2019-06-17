import React from "react";

const Dashboard = React.lazy(() => import("./views/Dashboard"));
const Requests = React.lazy(() => import("./views/Requests/Requests"));
const MActivities = React.lazy(() => import("./views/MActivities/MActivity"));

// --- My components

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: "/", exact: true, name: "Home" },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    exact: true
  },
  {
    path: "/company/monthlyactivites",
    name: "MonthlyActivites",
    component: MActivities
  },
  { path: "/requests", name: "Requests", component: Requests }
];

export default routes;
