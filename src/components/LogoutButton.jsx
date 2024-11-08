import { useLocalStorage } from "usehooks-ts";

function LogoutButton() {
  const [, setUserSession] = useLocalStorage("userSession", null);

  return (
    <>
      <button
        className="border rounded m-5 p-5"
        onClick={() => setUserSession(null)}
      >
        🪦
      </button>
    </>
  );
}

export default LogoutButton;
