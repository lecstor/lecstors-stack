import { UserDetails } from "./types";

export { UserDetails };

export function registerUser(details: UserDetails) {
  return fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  }).then((res) => res.json());
}
