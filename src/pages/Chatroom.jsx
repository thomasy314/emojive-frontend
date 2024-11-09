import CenteredContainer from "@commonComponents/CenteredContainer";
import Chat from "@components/Chat";
import { useSearchParams } from "react-router-dom";

function Chatroom() {
  const [URLSearchParams] = useSearchParams();

  return (
    <CenteredContainer>
      <Chat chatroomUUID={URLSearchParams.get("chatroomUUID")} />
    </CenteredContainer>
  );
}

export default Chatroom;
