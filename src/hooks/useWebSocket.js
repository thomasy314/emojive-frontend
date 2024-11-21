import { useEffect, useRef } from "react";

function useWebSocket(url, { subProtocols, onMessage }) {
  const ws = useRef(null);

  useEffect(() => {
    if (ws.current) {
      const oldConnection = ws.current;
      oldConnection.close();
      ws.current = null;
    }

    ws.current = new WebSocket(url, subProtocols);

    ws.current.onopen = () => {
      console.log(`ws connected to ${ws.current?.url}`);
    };

    ws.current.onclose = () => {
      console.log(`ws disconnected from ${ws.current?.url}`);
    };

    ws.current.onMessage = (event) => {
      onMessage(event);
    };

    return () => {
      ws.current?.close();
      console.log("ws connection closed");
    };
  }, [onMessage, subProtocols, url, ws]);

  function sendMessage(message) {
    ws.current?.send(message);
  }

  function closeWsConnection() {
    ws.current?.close();
  }

  return {
    ws,
    sendMessage,
    closeWsConnection,
  };
}

export default useWebSocket;
