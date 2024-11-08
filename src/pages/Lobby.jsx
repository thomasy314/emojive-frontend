import CenteredContainer from "@commonComponents/CenteredContainer";
import TextInput from "@commonComponents/TextInput";
import LogoutButton from "@components/LogoutButton";
import { useState } from "react";

function Lobby() {
  const [joinSpecificRoomInput, setJoinSpecificRoomInput] = useState("");

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
      </CenteredContainer>
    </>
  );
}

export default Lobby;
