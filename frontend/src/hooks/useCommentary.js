import { useQuery } from "@tanstack/react-query";

import { getCommentary } from "../services/commentaryService.js";

export function useCommentary(matchId) {
  return useQuery({
    queryKey: ["commentary", matchId],
    queryFn: () => getCommentary(matchId),
    enabled: !!matchId,
  });
}