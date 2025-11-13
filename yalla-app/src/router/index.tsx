// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import TripsList from "../pages/TripsList";
import TripDetail from "../pages/TripDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <TripsList /> },
      { path: "/trips/:id", element: <TripDetail /> },
    ],
  },
]);
