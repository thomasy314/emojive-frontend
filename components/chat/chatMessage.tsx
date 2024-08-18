import { IncomingChatMessage } from "../../types/types.chatMessages";

type ChatMessageProps = {
    messageData: IncomingChatMessage[]
}

/**
 * Formats and prints chat messages
 */
function ChatMessageDisplay({ messageData }: ChatMessageProps) {

    const messagesJSX = messageData.map((data, index) => {
        return <p key={index}>{data.clientId}: {data.message}</p>
    });

    return (
        <div className="flex flex-col text-center w-full h-64 border border-black rounded-xl neu-push overflow-y-auto scroll">
            {messagesJSX}
        </div>
    )
}

export default ChatMessageDisplay;