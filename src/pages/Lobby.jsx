import CenteredContainer from "@commonComponents/CenteredContainer";
import TextInput from "@commonComponents/TextInput";
import LogoutButton from "@components/LogoutButton";
import { useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";

function Lobby() {
  const [joinSpecificRoomInput, setJoinSpecificRoomInput] = useState("");
  const navigate = useNavigate();

  const handleJoinChatroom = () => {
    navigate({
      pathname: "/chatroom",
      search: createSearchParams({
        chatroomUUID: joinSpecificRoomInput,
      }).toString(),
    });
  };

  return (
    <>
      <LogoutButton />
      <CenteredContainer>
        <h1>Lobby</h1>
        <TextInput
          value={joinSpecificRoomInput}
          onChange={(event) => setJoinSpecificRoomInput(event.target.value)}
          placeholder="💬"
        />
        <button
          className="border rounded m-10 p-2"
          onClick={handleJoinChatroom}
        >
          📥test
        </button>
      </CenteredContainer>
    </>
  );
}

export default Lobby;
