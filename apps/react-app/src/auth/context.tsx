import React from "react";
import { Redirect, withRouter, RouteComponentProps } from "react-router-dom";

import { useQuery } from "urql";

import { getAuth } from "./queries";

export type AuthContext = {
  user?: { id: string; firstname: string; surname: string; emails: any[] };
};

const authContext = React.createContext<AuthContext>({});

const { Provider } = authContext;

export const AuthProvider = withRouter((props: RouteComponentProps) => {
  const [res] = useQuery({
    query: getAuth,
    requestPolicy: "network-only"
  });
  console.log(res);
  if (res.fetching) return null;
  console.log({ res, props });

  if (res.data && res.data.auth && res.data.auth.user) {
    // user is logged in
    if (/^\/p\//.test(props.location.pathname)) {
      // location is public so redirect to home
      return <Redirect to="/" />;
    }
    return <Provider value={res.data.auth} {...props} />;
  }

  // user is not logged in
  if (!/^\/p\//.test(props.location.pathname)) {
    // location is not public so redirect to login
    return <Redirect to="/p/login" />;
  }

  return <Provider value={{ user: undefined }} {...props} />;
});

export default authContext;
