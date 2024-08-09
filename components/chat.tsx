"use client"
import useWebSocket from "@/hooks/useWebSocket";
import { useEffect, useState } from "react";

function Chat() {

    const { ws, sendMessage } = useWebSocket();

    const [chatInput, setChatInput] = useState<string>("");
    const [chatMessages, setChatMessages] = useState<string[]>([])

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
        sendMessage(chatInput);
        setChatInput("");
    }

    return (
        <>
            <div className="flex flex-col text-center w-96 h-64 border border-black rounded-xl neu-push">
                {chatMessages.map((text, index) => {
                    return <p key={index}>{text}</p>
                })}
            </div>
            <input type="text" className="w-48 m-3 border border-black rounded" value={chatInput} onChange={e => setChatInput(e.target.value)} />
            <button className="border border-black rounded px-2" onClick={sendChat}>Send</button>
        </>
    )
}

export default Chat;