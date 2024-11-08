import CenteredContainer from "@commonComponents/CenteredContainer";
import TextInput from "@commonComponents/TextInput";
import useUsers from "@hooks/emojive/useUsers";
import * as emoji from "node-emoji";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

function Home() {
  const { createUser } = useUsers();
  const [userNameInput, setUserNameInput] = useState("");
  const [userSession, setUserSession] = useLocalStorage("userSession", null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userSession) {
      navigate("/lobby");
    }
  }, [navigate, userSession]);

  const handleUserNameInputChange = (event) => {
    const newVal = event.target.value;
    if (emoji.strip(newVal).length) {
      return;
    }
    setUserNameInput(newVal);
  };

  const handleCreateUser = async () => {
    const newUserData = await createUser(userNameInput, ["en"], "US");
    setUserSession(newUserData);
  };

  return (
    <CenteredContainer>
      <h1 className="text-4xl">👋</h1>
      <TextInput
        value={userNameInput}
        onChange={handleUserNameInputChange}
        placeholder="👤"
      />
      <button className="border rounded mt-10 p-2" onClick={handleCreateUser}>
        👉
      </button>
    </CenteredContainer>
  );
}

export default Home;
