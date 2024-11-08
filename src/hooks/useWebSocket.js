import { useEffect, useRef } from "react";

function useWebSocket(url, authToken) {
  const ws = useRef(null);

  useEffect(() => {
    if (ws.current) return;

    ws.current = new WebSocket(url, ["Authorization", `Token%20${authToken}`]);

    ws.current.onopen = () => {
      console.log(`ws connected to ${ws.current?.url}`);
    };
  }, [authToken, url, ws]);

  function sendMessage(message) {
    ws.current?.send(message);
  }

  function sendChatMessage(messageText) {
    const message = {
      messageType: "chat",
      messageText: messageText,
    };

    sendMessage(JSON.stringify(message));
  }

  return {
    ws: ws.current,
    sendMessage,
    sendChatMessage,
  };
}

export default useWebSocket;
