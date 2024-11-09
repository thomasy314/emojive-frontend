import TextInput from "@commonComponents/TextInput";

function ChatInput() {
  return (
    <div className="flex flex-col">
      <TextInput />
      <button>Send</button>
    </div>
  );
}

export default ChatInput;
