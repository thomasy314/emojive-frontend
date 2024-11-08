import PrivateRoute from "@commonComponents/PrivateRoute";
import Home from "@pages/Home";
import Lobby from "@pages/Lobby";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/lobby",
    element: (
      <PrivateRoute>
        <Lobby />
      </PrivateRoute>
    ),
  },
]);

export default router;
