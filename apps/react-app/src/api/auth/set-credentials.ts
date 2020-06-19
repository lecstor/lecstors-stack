import { Credentials } from "./types";

export { Credentials };

export function setCredentials(credentials: Credentials) {
  return fetch("/api/auth/set-credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((res) => res.json());
}
