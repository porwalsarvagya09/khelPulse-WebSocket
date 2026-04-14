import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload) {
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) continue;
    client.send(JSON.stringify(payload));
  }
}

export function attachWebSocketServer(server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
    maxPayload: 1024 * 1024,
  });

  wss.on("connection", (socket) => {
    console.log("WS Client connected");

    let isAuthenticated = false;

    socket.on("message", (msg) => {
      try {
        const data = JSON.parse(msg.toString());

        if (data.type === "auth") {
          if (!data.token) {
            socket.close(1008, "No token provided");
            return;
          }

          try {
            const decoded = jwt.verify(data.token, JWT_SECRET);

            socket.user = decoded;
            isAuthenticated = true;

            console.log("WS Authenticated:", decoded.username);

            sendJson(socket, { type: "welcome" });
          } catch (err) {
            console.error("Invalid token:", err.message);
            socket.close(1008, "Invalid token");
          }

          return;
        }

        if (!isAuthenticated) {
          socket.close(1008, "Unauthorized");
          return;
        }

        console.log("Received:", data);

      } catch (err) {
        console.error("WS Error:", err.message);
        socket.close(1008, "Invalid message format");
      }
    });

    socket.on("close", (code, reason) => {
      console.log("Client disconnected", code, reason?.toString());
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
  });

  function broadcastMatchCreated(match) {
    broadcast(wss, { type: "match_created", data: match });
  }

  return { broadcastMatchCreated };
}