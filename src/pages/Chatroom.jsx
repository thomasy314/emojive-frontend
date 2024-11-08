import { backendWsUrl } from "@config/backend.config";
import useWebSocket from "@hooks/useWebSocket";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

function Chatroom() {
  const [userSession] = useLocalStorage("userSession", null);
  const [URLSearchParams] = useSearchParams();

  const chatroomParams = createSearchParams({
    chatroomUUID: URLSearchParams.get("chatroomUUID"),
  }).toString();

  useWebSocket(
    `${backendWsUrl}/chatroom?${chatroomParams}`,
    userSession.userUUID
  );

  return (
    <div>
      <h1>Chatroom</h1>
    </div>
  );
}

export default Chatroom;
