import CenteredContainer from "@commonComponents/CenteredContainer";
import EmojiTextInput from "@components/EmojiTextInput";
import useEmojive from "@hooks/useEmojive";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

function Home() {
  const { createUser } = useEmojive();
  const [userNameInput, setUserNameInput] = useState("");
  const [userSession, setUserSession] = useLocalStorage("userSession", null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userSession) {
      navigate("/lobby");
    }
  }, [navigate, userSession]);

  const handleCreateUser = async () => {
    const newUserData = await createUser(userNameInput, ["en"], "US");
    setUserSession(newUserData);
  };

  return (
    <CenteredContainer>
      <h1 className="text-4xl">👋</h1>
      <EmojiTextInput
        value={userNameInput}
        onChange={setUserNameInput}
        placeholder="👤"
      />
      <button className="border rounded m-10 p-2" onClick={handleCreateUser}>
        👉
      </button>
    </CenteredContainer>
  );
}

export default Home;
