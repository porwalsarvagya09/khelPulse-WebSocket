import { useParams } from "react-router-dom";
import { useState } from "react";

import { useCommentary } from "../hooks/useCommentary.js";

import { useMatchWebSocket } from "../websocket/useMatchWebSocket.js";

function MatchDetailsPage() {
  const { id } = useParams();

  const [liveComments, setLiveComments] = useState([]);

  const { data, isLoading, error } = useCommentary(id);

  // REAL-TIME WS
  useMatchWebSocket(id, (newComment) => {
    setLiveComments((prev) => [newComment, ...prev]);
  });

  if (isLoading) {
    return (
      <div className="text-white text-2xl">
        Loading commentary...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-2xl">
        Failed to load commentary
      </div>
    );
  }

  const allComments = [
    ...liveComments,
    ...(data?.data || []),
  ];

  return (
    <div>
      <h1 className="text-5xl font-bold mb-8">
        Match #{id}
      </h1>

      <div className="space-y-4">
        {allComments.length === 0 ? (
          <div className="text-gray-400">
            No commentary available
          </div>
        ) : (
          allComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                
                <span className="text-green-400 font-semibold">
                  {comment.minute}'
                </span>

                <span className="text-gray-400 text-sm">
                  {comment.eventType}
                </span>
              </div>

              <h2 className="text-xl font-bold">
                {comment.actor}
              </h2>

              <p className="text-gray-300 mt-2">
                {comment.message}
              </p>

              <div className="mt-3 text-sm text-gray-500">
                {comment.team}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MatchDetailsPage;