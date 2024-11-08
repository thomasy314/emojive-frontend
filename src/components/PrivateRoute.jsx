import { Children } from "react";
import { Navigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

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
