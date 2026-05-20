import { useQuery } from "@tanstack/react-query";

import { getMatches } from "../services/matchService.js";

export function useMatches(limit = 10) {
  return useQuery({
    queryKey: ["matches", limit],
    queryFn: () => getMatches(limit),
  });
}