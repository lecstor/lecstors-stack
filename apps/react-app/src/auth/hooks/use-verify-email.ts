import useAuth from "./use-auth";
import { verifyEmail } from "../../api/auth/verify-email";

function useVerifyEmail() {
  const { setAuth } = useAuth();
  return (token: string) =>
    verifyEmail(token).then((res) => {
      if (res.error) {
        return res;
      } else {
        setAuth({ user: res });
      }
    });
}

export default useVerifyEmail;
