"use client"

import { useEffect, useState } from "react";
import { requestClientId } from "../../auth/clientId.auth";
import Chat from "./chat";

/**
 * Wrapper for the Chat component which handles retrieving the client ID 
 * which is needed for the chat to create a websocket connection
 */
function ChatWrapper() {

    const [clientId, setClientId] = useState<string | null>(null);

    useEffect(() => {
        requestClientId().then(setClientId);
    }, []);

    return (
        <>
            {
                clientId ? <Chat clientId={clientId} /> : <p>Loading Chat</p>
            }
        </>
    )
}

export default ChatWrapper;
