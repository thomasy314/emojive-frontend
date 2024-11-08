import PrivateRoute from "@components/PrivateRoute";
import Chatroom from "@pages/Chatroom";
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
  {
    path: "/chatroom",
    element: (
      <PrivateRoute>
        <Chatroom />
      </PrivateRoute>
    ),
  },
]);

export default router;
