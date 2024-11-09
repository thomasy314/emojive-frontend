import ElementList from "@commonComponents/ElementList";
import { useEffect } from "react";

function ChatDisplay({ messages }) {
  useEffect(() => {
    console.log("Messages: ", messages);
  }, [messages]);

  const Element = ({ message }) => (
    <p className="pt-5">
      {message.value.sender + ": " + message.value.messageText}
    </p>
  );

  return (
    <div className="border rounded min-h-10 w-full max-h-40 overflow-auto">
      <ElementList data={messages} element={Element} attribute="message" />
    </div>
  );
}

export default ChatDisplay;
