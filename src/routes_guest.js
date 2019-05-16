import React from "react";

const NewRequest = React.lazy(() => import("./views/Guests/NewRequest"));
const DetailsPage = React.lazy(() => import("./views/Guests/Details"));

const routes = [
  { path: "/guest", exact: true, name: "HomeGuest", component: DetailsPage },
  { path: "/guest/newRequest", name: "NewRequest", component: NewRequest }
];

export default routes;
