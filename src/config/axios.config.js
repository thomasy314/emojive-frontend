import axios from "axios";
import { backendHttpUrl } from "./backend.config";

const emojiveBackend = axios.create({
  baseURL: backendHttpUrl,
});

export default emojiveBackend;
