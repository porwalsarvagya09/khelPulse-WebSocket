import api from "../api/axios";

export async function loginAdmin(credentials) {
  const response = await api.post("/auth/login", credentials);

  return response.data;
}