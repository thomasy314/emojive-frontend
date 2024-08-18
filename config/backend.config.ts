type BackendConfig = {
    WEBSOCKET_ENDPOINT: string,
    HTTP_ENDPOINT: string
}

const backendConfig: BackendConfig = {
    WEBSOCKET_ENDPOINT: 'ws://' + process.env.BACKEND_ENDPOINT ?? "127.0.0.1:8080",
    HTTP_ENDPOINT: 'http://' + process.env.BACKEND_ENDPOINT ?? "127.0.0.1:8080",
}

export default backendConfig;