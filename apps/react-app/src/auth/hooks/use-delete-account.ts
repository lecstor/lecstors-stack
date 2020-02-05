import { deleteAccount } from "../../api/auth/delete-account";
import useAuth from "./use-auth";

function useUnregister() {
  const { setAuth } = useAuth();
  return () =>
    deleteAccount()
      .then(() => {
        setAuth({ user: null });
      })
      .catch(() => ({ error: "Server Error " }));
}

export default useUnregister;
