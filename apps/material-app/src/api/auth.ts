import { Credentials, UserDetails } from "../types";

const headers = {
  "Content-Type": "application/json",
};

const method = "POST";

export function deleteAccount() {
  return fetch("/api/auth/delete-account", {
    method: "POST",
    headers,
  });
}

export function fetchAuthUser() {
  return fetch("/api/auth/user", {
    method: "GET",
    headers,
    credentials: "include",
  }).then((res) => res.json());
}

export function logIn(credentials: Credentials) {
  return fetch("/api/auth/login", {
    method,
    headers,
    body: JSON.stringify(credentials),
  }).then((res) => res.json());
}

export function logOut() {
  return fetch("/api/auth/logout", { method });
}

export function registerUser(details: UserDetails) {
  return fetch("/api/auth/register", {
    method,
    headers,
    body: JSON.stringify(details),
  }).then((res) => res.json());
}

export function setCredentials(credentials: Credentials) {
  return fetch("/api/auth/set-credentials", {
    method,
    headers,
    body: JSON.stringify(credentials),
  }).then((res) => res.json());
}

export function verifyEmail(token: string) {
  return fetch("/api/auth/verify-email", {
    method,
    headers,
    body: JSON.stringify({ token }),
  }).then((res) => res.json());
}
