import { useContext } from "react";

import * as authApi from "../api/auth";
import { AuthContext, Credentials, UserDetails } from "../types";

import { authContext } from "./provider";

export const useAuth = (): AuthContext => useContext(authContext);

export function useDeleteAccount() {
  const { setAuth } = useAuth();
  return () =>
    authApi
      .deleteAccount()
      .then(() => {
        setAuth(null);
      })
      .catch(() => ({ error: "Server Error " }));
}

export function useLogIn() {
  const { fetchUser } = useAuth();
  return (credentials: Credentials) =>
    authApi.logIn(credentials).then((res) => (res.error ? res : fetchUser()));
}

export function useLogOut() {
  const { setAuth } = useAuth();
  return () =>
    authApi.logOut().then(() => {
      setAuth(null);
    });
}

export function useRegister() {
  const { fetchUser } = useAuth();
  return (details: UserDetails) =>
    authApi
      .registerUser(details)
      .then((res) => (res.error ? res : fetchUser()));
}

export function useSetCredentials() {
  return (credentials: Credentials) => authApi.setCredentials(credentials);
}

export function useVerifyEmail() {
  const { fetchUser } = useAuth();
  return (token: string) =>
    authApi.verifyEmail(token).then((res) => (res.error ? res : fetchUser()));
}
