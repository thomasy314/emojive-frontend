import { Children } from "react";

function CenteredContainer({ children }) {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center">
      {Children.toArray(children)}
    </div>
  );
}

export default CenteredContainer;
