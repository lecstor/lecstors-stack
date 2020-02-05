import { Credentials } from "./types";

export { Credentials };

export function logIn(credentials: Credentials) {
  return fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  }).then(res => res.json());
}
