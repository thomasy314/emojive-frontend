
type ChatWarningProps = {
    message: string,
    showBanner: boolean,
}

/**
 * Banner used to show non-chat messages to users
 */
function ChatBanner({ message, showBanner }: ChatWarningProps) {
    return (
        <p className="m-3" hidden={!showBanner}>{message}</p>
    )
}

export default ChatBanner;