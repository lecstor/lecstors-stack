import React, { FC, createContext, useEffect, useState } from "react";

import { fetchAuthUser } from "../api/auth";

import { Auth, AuthContext } from "../types";

const placeholderUser = { id: "", firstname: "", surname: "", groups: [] };
const anonymousAuth = { loggedIn: false, user: placeholderUser };

export const authContext = createContext<AuthContext>({
  auth: anonymousAuth,
  setAuth: () => undefined,
  fetchUser: () => undefined,
});

const { Provider } = authContext;

const AuthProvider: FC = ({ children }) => {
  const [auth, setAuthState] = useState<Auth>({
    loggedIn: false,
    user: placeholderUser,
  });

  const setAuth = (auth: Auth | null) =>
    setAuthState(auth === null ? anonymousAuth : auth);

  const fetchUser = () => {
    fetchAuthUser().then((auth) =>
      setAuth({ loggedIn: Boolean(auth.user.id), ...auth })
    );
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return <Provider value={{ auth, setAuth, fetchUser }}>{children}</Provider>;
};

export default AuthProvider;
