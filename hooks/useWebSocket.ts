"use client"

import { useEffect, useRef } from "react";

const url = process.env.REACT_APP_WEBSOCKET_ENDPOINT ?? "ws://127.0.0.1:8080";

/**
 * React hook that handles the creation and event handling with the backend websocket 
 * @returns 
 */
function useWebSocket() {
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (ws.current) return;

        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
            console.log(`ws connected to ${ws.current?.url}`);
        }

        ws.current.onclose = () => console.log(`ws closed with ${ws.current?.url}`);
    }, []);

    /**
     * Formats and sends message to server
     * @param {string} messageText message string being sent to websocket
     */
    function sendMessage(messageText: string) {
        const message = {
            message: messageText
        }

        ws.current?.send(JSON.stringify(message));
    }

    return {
        ws,
        sendMessage
    }
}

export default useWebSocket;