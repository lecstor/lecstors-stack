import { setCredentials, Credentials } from "../../api/auth/set-credentials";

function useSetCredentials() {
  return (credentials: Credentials) => setCredentials(credentials);
}

export default useSetCredentials;
