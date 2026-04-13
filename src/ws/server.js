import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

function sendJson(socket, payload) {
    if(socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload) {
    for (const client of wss.clients) {
        if (client.readyState !== WebSocket.OPEN) continue;

        client.send(JSON.stringify(payload));
    }
}

export function attachWebSocketServer(server) {
   const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 1024 * 1024 });

  wss.on('connection', (socket, req) => {
        try {
        
            const url = new URL(req.url, `http://${req.headers.host}`);
            const token = url.searchParams.get("token");

      
            if (!token) {
                console.log("No token provided");
                socket.close(1008, "Unauthorized");
                return;
            }

            const decoded = jwt.verify(token, JWT_SECRET);

            socket.user = decoded;

            console.log("WS Authenticated user:", decoded.username);

            sendJson(socket, { type: 'welcome' });

            socket.on('message', (msg) => {
                console.log("Received:", msg.toString());
            });

            socket.on('close', (code, reason) => {
                console.log("Client disconnected", code, reason?.toString());
            });

            socket.on('error', (err) => {
                console.error("Socket error:", err);
            });

        } catch (err) {
            console.error("WS Auth failed:", err.message);
            socket.close(1008, "Invalid token");
        }
    });

   function broadcastMatchCreated(match) {
        broadcast(wss, { type: 'match_created', data: match });
    }

    return { broadcastMatchCreated }
}