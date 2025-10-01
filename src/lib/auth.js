import { api, setToken } from "@/lib/http";

export async function login(username, password) {
  const { data } = await api.post("/auth/login", { username, password });
  setToken(data.access_token);
  return data;
}
export async function refreshToken() {
  const { data } = await api.post(`/auth/refresh-token`);
  setToken(data.access_token);
  return data;
}
