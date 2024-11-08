import useLocalStorage from "@hooks/useLocalStorage";
import { Children } from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const [userSession] = useLocalStorage("userSession", null);

  return (
    <>
      {userSession ? (
        Children.toArray(children)
      ) : (
        <Navigate to="/" replace={true} />
      )}
    </>
  );
}

export default PrivateRoute;
