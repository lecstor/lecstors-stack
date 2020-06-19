import { logIn, Credentials } from "../../api/auth/log-in";

import useAuth from "./use-auth";

function useLogIn() {
  const { setAuth } = useAuth();
  return (credentials: Credentials) =>
    logIn(credentials).then((res) => {
      if (res.error) {
        return res;
      } else {
        setAuth({ user: res });
      }
    });
}

export default useLogIn;
