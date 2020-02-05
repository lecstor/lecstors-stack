export function fetchAuthUser() {
  return fetch("/api/auth/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  }).then(res => res.json());
}
