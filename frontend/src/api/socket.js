import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// Create a single socket instance. We won't auto-connect; CoursePage will connect when mounted.
const socket = io(SOCKET_URL, {
  autoConnect: false,
  // do not include credentials (cookies) in socket requests by default
  // this avoids CORS requiring a specific Access-Control-Allow-Origin header
  withCredentials: false,
});

export default socket;
