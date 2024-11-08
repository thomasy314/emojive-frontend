import axios from "axios";

const emojiveBackend = axios.create({
  baseURL: import.meta.env.REACT_APP_BACKEND_URL ?? "http://127.0.0.1:8080",
});

export default emojiveBackend;
