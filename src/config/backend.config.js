const url = import.meta.env.VITE_BACKEND_URL ?? "127.0.0.1:8080";

const backendHttpUrl = `http://${url}`;
const backendWsUrl = `ws://${url}`;

export { backendHttpUrl, backendWsUrl, url };
