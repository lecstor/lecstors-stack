import React, { FC, createContext, useEffect, useState } from "react";

import { fetchAuthUser } from "../api/auth/fetch-auth-user";

type Group = {
  id: string;
  isPrimary?: boolean;
  name: string;
  privileges: string;
  type: string;
};

export type Auth = {
  user?: { id: string; firstname: string; surname: string; groups: Group[] };
};

export type AuthContext = {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
};

export const authContext = createContext<AuthContext>({
  auth: {},
  setAuth: () => undefined,
});

const { Provider } = authContext;

const AuthProvider: FC = ({ children }) => {
  const [auth, setAuth] = useState<AuthContext["auth"]>();

  useEffect(() => {
    fetchAuthUser().then((auth) => setAuth(auth));
  }, []);

  return <Provider value={{ auth, setAuth }}>{children}</Provider>;
};

export default AuthProvider;
