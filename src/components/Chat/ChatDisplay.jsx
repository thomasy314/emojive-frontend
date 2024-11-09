import ElementList from "@commonComponents/ElementList";

function ChatDisplay({ messages }) {
  const Element = ({ message }) => {
    if (message.key !== "chat") {
      console.error(message);
      return <p>error</p>;
    }

    return (
      <p className="pt-5">
        {message.value.sender + ": " + message.value.messageText}
      </p>
    );
  };

  return (
    <div className="border rounded min-h-10 w-full max-h-40 overflow-auto">
      <ElementList data={messages} element={Element} attribute="message" />
    </div>
  );
}

export default ChatDisplay;
