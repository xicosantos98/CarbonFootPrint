import React from "react";

const Dashboard = React.lazy(() => import("./views/DashboardOrg/Dashboard"));
const MActivities = React.lazy(() => import("./views/MActivities/MActivity"));
const NewActivity = React.lazy(() => import("./views/MActivities/Create"));
const Products = React.lazy(() => import("./views/Products/Products"));
const ProductDetails = React.lazy(() => import("./views/Products/Details"));
const MCosts = React.lazy(() => import("./views/MCosts/MCosts"));
const CostTypes = React.lazy(() => import("./views/CostTypes/CostType"));
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
    component: MActivities,
    exact: true
  },
  {
    path: "/company/monthlyactivites/create",
    name: "CreateMonthlyActivity",
    component: NewActivity
  },
  {
    path: "/company/products",
    name: "Products",
    component: Products,
    exact: true
  },
  {
    path: "/company/products/details/:id",
    name: "Product Details",
    component: ProductDetails
  },
  {
    path: "/company/monthlycosts",
    name: "MonthlyCosts",
    component: MCosts,
    exact: true
  },
  {
    path: "/company/cost_types",
    name: "CostTypes",
    component: CostTypes,
    exact: true
  }
];

export default routes;
