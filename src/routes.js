import React from "react";

const Dashboard = React.lazy(() => import("./views/Dashboard"));
const Requests = React.lazy(() => import("./views/Requests/Requests"));
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
  { path: "/requests", name: "Requests", component: Requests }
];

export default routes;
