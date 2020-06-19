export function deleteAccount() {
  return fetch("/api/auth/delete-account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
