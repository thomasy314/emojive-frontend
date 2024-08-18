"use client"

import { useEffect, useRef } from "react";
import { OutgoingChatMessage } from "../types/types.chatMessages";


type UseWebSocketProps = {
    clientId: string
}

/**
 * React hook that handles the creation and event handling with the backend websocket 
 * @returns 
 */
function useWebSocket(url: string, { clientId }: UseWebSocketProps) {
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (ws.current) return;

        ws.current = new WebSocket(url, ["clientId", clientId]);

        ws.current.onopen = () => {
            console.log(`ws connected to ${ws.current?.url}`);
        }

        ws.current.onclose = () => console.log(`ws closed with ${ws.current?.url}`);
    }, []);

    /**
     * Sends string as websocket message
     * @param {string} messageText - message string being sent to websocket
     */
    function sendMessage(message: string) {
        ws.current?.send(message);
    }

    /**
     * Formats input for chat message and sends to websocket server
     * @param {string} messageText - chat message
     */
    function sendChatMessage(messageText: string) {
        const message: OutgoingChatMessage = {
            message: messageText
        }

        sendMessage(JSON.stringify(message));
    }

    return {
        ws,
        sendMessage,
        sendChatMessage
    }
}

export default useWebSocket;