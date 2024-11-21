import EmojiTextInput from "@components/EmojiTextInput";
import { backendWsUrl } from "@config/backend.config";
import useWebSocket from "@hooks/useWebSocket";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import ChatDisplay from "./ChatDisplay";

function Chat({ chatroomUUID }) {
  const [userSession] = useLocalStorage("userSession", null);
  const [messages, setMessages] = useLocalStorage(
    `chatroom:messages:${chatroomUUID}`,
    []
  );
  const [messageInput, setMessageInput] = useState("");

  const subProtocols = ["Authorization", `Token%20${userSession.userUUID}`];

  const onMessage = (event) => {
    const message = JSON.parse(event.data);
    console.log("received message", message);
    setMessages((oldMessages) => [...oldMessages, message]);
  };

  const { sendMessage } = useWebSocket(`${backendWsUrl}/chatroom`, {
    subProtocols,
    onMessage,
  });

  const handleSendMessage = () => {
    const message = {
      messageType: "chat",
      messageText: messageInput,
    };

    sendMessage(JSON.stringify(message));
  };

  return (
    <div className="border rounded inline-block p-10">
      <div className="flex flex-col items-center">
        <h1>Chat</h1>
        <ChatDisplay messages={messages} />
        <EmojiTextInput
          value={messageInput}
          onChange={(event) => setMessageInput(event.target.value)}
        />
        <button onClick={handleSendMessage}>📤</button>
      </div>
    </div>
  );
}

export default Chat;
