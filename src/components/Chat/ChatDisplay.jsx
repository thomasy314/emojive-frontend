import ElementList from "@commonComponents/ElementList";

function ChatDisplay({ messages }) {
  const Element = ({ message }) => {
    if (message.messageType !== "chat") {
      console.error(message);
      return null;
    }

    return (
      <p className="pt-5">{message.sender + ": " + message.messageText}</p>
    );
  };

  return (
    <div className="flex flex-col-reverse border rounded min-h-10 w-full max-h-40 overflow-auto">
      <ElementList data={messages} element={Element} attribute="message" />
    </div>
  );
}

export default ChatDisplay;
