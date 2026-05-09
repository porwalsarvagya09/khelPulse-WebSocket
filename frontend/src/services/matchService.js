import api from "../api/axios";

export async function getMatches(limit = 10) {
  const response = await api.get(`/matches?limit=${limit}`);

  return response.data;
}