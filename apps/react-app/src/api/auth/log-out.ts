export function logOut() {
  return fetch("/api/auth/logout", { method: "POST" });
}
