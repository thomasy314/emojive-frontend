"use client"
import EmojiTextArea from "@/components/textArea/emojiTextArea";
import useWebSocket from "@/hooks/useWebSocket";
import { hasOnlyEmojis } from "@/utils/emojiUtils/emojiUtils";
import { useEffect, useState } from "react";

function Chat() {

    const { ws, sendMessage } = useWebSocket();

    const [chatInput, setChatInput] = useState<string>("");
    const [chatMessages, setChatMessages] = useState<string[]>([])
    const [showOnlyEmojiWarning, setShowOnlyEmojiWarning] = useState<Boolean>(false);

    useEffect(() => {
        if (!ws.current) return;

        ws.current.onmessage = (message) => {
            setChatMessages(oldMessages => {
                const messageText = JSON.parse(message.data).message;
                return [messageText, ...oldMessages]
            })
        }
    }, [ws])

    function sendChat() {
        if (chatInput.length <= 0) return;

        if (hasOnlyEmojis(chatInput)) {
            setShowOnlyEmojiWarning(true);
        } else {
            sendMessage(chatInput);
            setChatInput("");
            setShowOnlyEmojiWarning(false);
        }
    }

    const messages = chatMessages.map((text, index) => {
        return <p key={index}>{text}</p>
    });

    return (
        <div className="flex flex-col text-center justify-center items-center m-3 w-96 max-w-[90%]">
            {showOnlyEmojiWarning && <p className="my-3">Please ensure you only have emojis in your text before you send!</p>}
            <div className="flex flex-col text-center w-full h-64 border border-black rounded-xl neu-push overflow-y-auto scroll">
                {messages}
            </div>
            <EmojiTextArea onChange={e => setChatInput(e.target.value)} value={chatInput} className="w-48 my-3 border border-black rounded resize-none" />
            <button className="border border-black rounded px-2" onClick={sendChat}>Send</button>
        </div>
    )
}

export default Chat;