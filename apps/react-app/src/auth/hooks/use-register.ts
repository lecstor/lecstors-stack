import { registerUser, UserDetails } from "../../api/auth/register-user";

import useAuth from "./use-auth";

function useRegister() {
  const { setAuth } = useAuth();
  return (details: UserDetails) =>
    registerUser(details).then((res) => {
      if (res.error) {
        return res;
      } else {
        setAuth({ user: res });
      }
    });
}

export default useRegister;
