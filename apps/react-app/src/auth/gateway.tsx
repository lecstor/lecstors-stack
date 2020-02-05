import React, { FC } from "react";
import { Redirect, useLocation } from "react-router-dom";

import useAuth from "./hooks/use-auth";

const AuthGateway: FC = ({ children }) => {
  const { auth } = useAuth();
  const { pathname } = useLocation();

  if (!auth) return null;

  if (auth.user) {
    // user is logged in
    if (/^\/a\//.test(pathname)) {
      // location is public auth (login) so redirect to home
      return <Redirect to="/" />;
    }
    return <>{children}</>;
  }

  // user is not logged in
  if (!/^\/a\//.test(pathname)) {
    // location is not public so redirect to login
    return <Redirect to="/a/login" />;
  }

  return <>{children}</>;
};

export default AuthGateway;
