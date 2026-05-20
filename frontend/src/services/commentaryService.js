import api from "../api/axios";

export async function getCommentary(matchId, limit = 50) {
  const response = await api.get(
    `/matches/${matchId}/commentary?limit=${limit}`
  );

  return response.data;
}