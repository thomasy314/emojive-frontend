import { backendWsUrl } from "@config/backend.config";
import useWebSocket from "@hooks/useWebSocket";
import { useEffect, useReducer } from "react";
import { createSearchParams } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import ChatDisplay from "./ChatDisplay";
import ChatInput from "./ChatInput";

function reducer(messages, action) {
  switch (action.type) {
    case "ADD_MESSAGE":
      return [...messages, action.payload];
    default:
      return messages;
  }
}

function Chat({ chatroomUUID }) {
  const [userSession] = useLocalStorage("userSession", null);

  const [messages, dispatch] = useReducer(reducer, []);

  const chatroomParams = createSearchParams({
    chatroomUUID: chatroomUUID,
  }).toString();

  const { ws } = useWebSocket(
    `${backendWsUrl}/chatroom?${chatroomParams}`,
    userSession.userUUID
  );

  useEffect(() => {
    if (!ws) return;

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      dispatch({ type: "ADD_MESSAGE", payload: message });
    };
  }, [ws]);

  return (
    <div className="border rounded inline-block p-10">
      <div className="flex flex-col items-center">
        <h1>Chat</h1>
        <ChatDisplay messages={messages} />
        <ChatInput />
      </div>
    </div>
  );
}

export default Chat;
