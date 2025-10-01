export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("token");
  return Boolean(token);
}
