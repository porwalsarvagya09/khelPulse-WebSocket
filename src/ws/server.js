import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;


// MATCH SUBSCRIPTIONS
const matchSubscribers = new Map();

function subscribe(matchId, socket) {
  if (!matchSubscribers.has(matchId)) {
    matchSubscribers.set(matchId, new Set());
  }

  matchSubscribers.get(matchId).add(socket);
}

function unsubscribe(matchId, socket) {
  const subs = matchSubscribers.get(matchId);
  if (!subs) return;

  subs.delete(socket);

  if (subs.size === 0) {
    matchSubscribers.delete(matchId);
  }
}

function cleanup(socket) {
  if (!socket.subscriptions) return;

  for (const matchId of socket.subscriptions) {
    unsubscribe(matchId, socket);
  }
}


// HELPERS
function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(payload));
}

function broadcastToMatch(matchId, payload) {
  const subs = matchSubscribers.get(matchId);
  if (!subs) return;

  const message = JSON.stringify(payload);

  for (const client of subs) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

function broadcastToAll(wss, payload) {
  const message = JSON.stringify(payload);

  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

// MAIN WS SERVER
export function attachWebSocketServer(server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
    maxPayload: 1024 * 1024,
  });

  wss.on("connection", (socket) => {
    console.log("WS client connected");

    socket.isAuthenticated = false;
    socket.subscriptions = new Set();

    socket.on("message", (msg) => {
      try {
        const data = JSON.parse(msg.toString());

        //AUTH
        if (data.type === "auth") {
          if (!data.token) {
            return socket.close(1008, "No token provided");
          }

          try {
            const decoded = jwt.verify(data.token, JWT_SECRET);
            socket.user = decoded;
            socket.isAuthenticated = true;

            console.log("WS authenticated:", decoded.username);

            sendJson(socket, { type: "welcome" });
          } catch (err) {
            console.error("Invalid token:", err.message);
            return socket.close(1008, "Invalid token");
          }

          return;
        }

        //BLOCK if not authenticated
        if (!socket.isAuthenticated) {
          return socket.close(1008, "Unauthorized");
        }

        //SUBSCRIBE
        if (data.type === "subscribe") {
          const matchId = Number(data.matchId);

          if (!Number.isInteger(matchId)) {
            return sendJson(socket, { type: "error", message: "Invalid matchId" });
          }

          subscribe(matchId, socket);
          socket.subscriptions.add(matchId);

          sendJson(socket, { type: "subscribed", matchId });
          return;
        }

        //UNSUBSCRIBE
        if (data.type === "unsubscribe") {
          const matchId = Number(data.matchId);

          unsubscribe(matchId, socket);
          socket.subscriptions.delete(matchId);

          sendJson(socket, { type: "unsubscribed", matchId });
          return;
        }

        //OTHER MESSAGES (future use)
        console.log("Received:", data);

      } catch (err) {
        console.error("WS error:", err.message);
        socket.close(1008, "Invalid message format");
      }
    });

    socket.on("close", () => {
      console.log("WS client disconnected");
      cleanup(socket);
    });

    socket.on("error", (err) => {
      console.error("WS socket error:", err);
    });
  });

 
  // BROADCAST FUNCTIONS
 

  function broadcastMatchCreated(match) {
    broadcastToAll(wss, { type: "match_created", data: match });
  }

  function broadcastCommentary(matchId, comment) {
    broadcastToMatch(matchId, {
      type: "commentary",
      matchId,
      data: comment,
    });
  }

  return {
    broadcastMatchCreated,
    broadcastCommentary,
  };
}