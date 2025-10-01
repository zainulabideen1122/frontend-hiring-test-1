import axios from "axios";

const API_BASE = "https://frontend-test-api.aircall.dev";
const TOKEN_STORAGE_KEY = "token";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshPromise = null;

function refreshTokenRequest() {
  return axios.post(
    `${API_BASE}/auth/refresh-token`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error?.response?.status;


    const url = (originalRequest.url || "").toString();
    const isAuthEndpoint =
      url.includes("/auth/login") || url.includes("/auth/refresh-token");

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (!isRefreshing) {
        // Start a single refresh
        isRefreshing = true;
        refreshPromise = refreshTokenRequest()
          .then(({ data }) => {
            setToken(data.access_token);
            return data.access_token;
          })
          .catch((e) => {
            clearToken();
            if (typeof window !== "undefined")
              window.location.replace("/auth/login");
            throw e;
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      try {
        const newToken = await refreshPromise;
        // Retry original request with the new token
        originalRequest._retry = true;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export { api, getToken, setToken, clearToken };
