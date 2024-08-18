"use client"
import EmojiTextArea from "@/components/emojiTextArea";
import backendConfig from "@/config/backend.config";
import useWebSocket from "@/hooks/useWebSocket";
import { hasOnlyEmojis } from "@/utils/emojiUtils/emojiUtils";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import ChatBanner from "./chatBanner";
import ChatMessageDisplay from "./chatMessage";

type ChatProps = {
    clientId: string
}

/**
 * Chat component which can connect to a websocket connection, send messages, and show the chatroom messages
 */
function Chat({ clientId }: ChatProps) {

    const { ws, sendChatMessage } = useWebSocket(backendConfig.WEBSOCKET_ENDPOINT, { clientId });

    const [chatInput, setChatInput] = useState<string>("");
    const [chatMessages, setChatMessages] = useState<string[]>([])
    const [showOnlyEmojiWarning, setShowOnlyEmojiWarning] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!ws.current) return;

        ws.current.onmessage = (message) => {
            setChatMessages(oldMessages => {
                const messageText = JSON.parse(message.data).message;
                return [messageText, ...oldMessages]
            })
        }
    }, [ws])

    /**
     * Handles message submissions by confirming they are formatted properly 
     * and sending them to the server correct
     * @param {FormEvent} event 
     */
    function handlerOnSubmit(event: FormEvent): void {
        event.preventDefault();
        if (chatInput.length === 0) return;
        const sentSuccessful: boolean = sendChat(chatInput);
        if (sentSuccessful) {
            setChatInput("");
            setShowOnlyEmojiWarning(false);
        } else {
            setShowOnlyEmojiWarning(true);
        }
    }

    /**
     * Sends message to websocket and returns if successful
     * @returns {boolean} Indicates if the message was successfully sent
     */
    function sendChat(message: string): boolean {
        if (hasOnlyEmojis(message)) {
            sendChatMessage(message)
            return true;
        } else {
            return false;
        }
    }

    /**
     * Submits form when the enter button (without shift) is pressed
     * @param {KeyboardEvent<HTMLTextAreaElement>} event 
     */
    function handleTextAreaSubmit(event: KeyboardEvent<HTMLTextAreaElement>): void {
        if (event.key.toLowerCase() == "enter" && event.shiftKey == false) {
            event.preventDefault();
            formRef.current?.requestSubmit();
        }
    }

    return (
        <div className="flex flex-col text-center justify-center items-center m-3 w-96 max-w-[90%]">
            <ChatBanner showBanner={showOnlyEmojiWarning} message="Please ensure you only have emojis in your text before you send!" />
            <ChatMessageDisplay messages={chatMessages} />
            <form className="flex flex-col items-center" ref={formRef} onSubmit={handlerOnSubmit}>
                <EmojiTextArea
                    onKeyDown={handleTextAreaSubmit}
                    className="w-48 my-3 border border-black rounded resize-none"
                    onTextChange={newText => setChatInput(newText)}
                    value={chatInput}
                />
                <button type="submit" className="border border-black rounded px-2">Send</button>
            </form>
        </div>
    )
}

export default Chat;