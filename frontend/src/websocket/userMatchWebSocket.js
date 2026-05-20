import { useEffect } from "react";

export function useMatchWebSocket(matchId, onMessage) {
  useEffect(() => {
    if (!matchId) return;

    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      console.log("WS Connected");

      // AUTH
      ws.send(
        JSON.stringify({
          type: "auth",
          token: localStorage.getItem("token"),
        })
      );

      // SUBSCRIBE
      ws.send(
        JSON.stringify({
          type: "subscribe",
          matchId: Number(matchId),
        })
      );
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      console.log("WS Message:", message);

      if (message.type === "commentary") {
        onMessage(message.data);
      }
    };

    ws.onerror = (error) => {
      console.error("WS Error:", error);
    };

    ws.onclose = () => {
      console.log("WS Disconnected");
    };

    return () => {
      ws.close();
    };
  }, [matchId, onMessage]);
}