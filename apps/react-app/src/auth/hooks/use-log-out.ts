import { logOut } from "../../api/auth/log-out";
import useAuth from "./use-auth";

function useLogOut() {
  const { setAuth } = useAuth();
  return () =>
    logOut().then(() => {
      setAuth({ user: undefined });
    });
}

export default useLogOut;
