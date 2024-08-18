type ChatMessageProps = {
    messages: string[]
}

/**
 * Formats and prints chat messages
 */
function ChatMessageDisplay({ messages }: ChatMessageProps) {

    const messagesJSX = messages.map((text, index) => {
        return <p key={index}>{text}</p>
    });

    return (
        <div className="flex flex-col text-center w-full h-64 border border-black rounded-xl neu-push overflow-y-auto scroll">
            {messagesJSX}
        </div>
    )
}

export default ChatMessageDisplay;